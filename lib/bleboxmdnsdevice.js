'use strict';

const { Device } = require('homey');
const BleBoxAPI = require('./bleboxapi.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class BleBoxMDNSDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.bbApi = new BleBoxAPI();
    this.polling = false;
    this.addListener('poll', this.pollDevice);

    await this.onBleBoxInit();

    this.log(this.getName().concat( ' has been initialized'));
    this.emit('poll');
  }

  async onBleBoxInit()
  {
    // To be overridden if additional initialization needed
  }

  /**
   * if the discovered device is this device - return true
   */
   onDiscoveryResult(discoveryResult)
  {
    return discoveryResult.id === this.getData().id;
  }

  /**
   * This method will be executed once when the device has been found (onDiscoveryResult returned true)
   */
   async onDiscoveryAvailable(discoveryResult)
  {
    if(!this.polling) this.emit('poll');
  }

  /**
   * Update the address and reconnect
   */
   onDiscoveryAddressChanged(discoveryResult)
  {
    this.log('Address changed.');
    if(discoveryResult.address != '')
    {
      this.setSettings(
        {
          address: discoveryResult.address
        });
      if(!this.polling) this.emit('poll');
    }
  }

  /**
   * When device was offline and shows up again - reconnect
   */
   onDiscoveryLastSeenChanged(discoveryResult)
  {
    if(!this.polling) this.emit('poll');
  }

  /**
   * polling to get the current state and energy values
   */
  async pollDevice()
	{
    if(this.polling) return;
    this.polling = true;
    while(this.polling)
    {
      // First check current device settings (which may change e.g. after firmware upgrade)
      if(this.getAvailable())
      {
        await this.bbApi.getDeviceState(this.getSetting('address'))
        .then(result => {
          try {
            this.setSettings(
              {
                product: result.product != null ? String(result.product) : 'n/a',
                hv: result.hv != null ? String(result.hv) : 'n/a',
                fv: result.fv != null ? String(result.fv) : 'n/a',
                apiLevel: result.apiLevel != null ? String(result.apiLevel) : 'n/a'
              }
            )
          } catch(err) { this.log('setSettings error:', err.message); }
        })
        .catch(error => {
          this.log(error);
        })

        await this.pollBleBox()
        .catch(error => {
          this.log(error);
        })
      }
      await delay(this.getSetting('poll_interval'));
    }
    this.polling = false;
	}

  async pollBleBox()
  {
    // to be overridden
  }

  async onDeleted()
  {
   this.polling = false;
  }


}

module.exports = BleBoxMDNSDevice;
