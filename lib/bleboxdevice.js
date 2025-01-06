'use strict';

const { Device } = require('homey');
const BleBoxAPI = require('./bleboxapi.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class BleBoxDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.bbApi = new BleBoxAPI();
    this.polling = false;

    await this.onBleBoxInit();

    if(this.getSetting('polling_enabled')=='Yes')
    {
      this.addListener('poll', this.pollDevice);
      this.emit('poll');      
    }
    else
    {
      this.setAvailable();
      // First check current device settings (which may change e.g. after firmware upgrade)
      await this.bbApi.getDeviceState(this.getSetting('address'))
      .then(result => {
        this.setSettings(
          {
            product: result.product != null ? result.product : 'n/a',
            hv: result.hv != null ? result.hv : 'n/a',
            fv: result.fv != null ? result.fv : 'n/a',
            apiLevel: result.apiLevel != null ? result.apiLevel : 'n/a'
          }
        )
      })
      .catch(error => {
        this.log(error);
      })

    }

    this.log(this.getName().concat(' has been initialized'));
  }

  async onBleBoxInit()
  {
    // To be overridden if additional initialization needed
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
      await this.bbApi.getDeviceState(this.getSetting('address'))
      .then(result => {
        this.setAvailable();
        this.setSettings(
          {
            product: result.product,
            hv: result.hv,
            fv: result.fv,
            apiLevel: result.apiLevel
          }
        )
      })
      .catch(error => {
        this.setUnavailable();
        this.log(error);
      })

      if(this.getAvailable())
      {
        const tz  = this.homey.clock.getTimezone();
        const date = new Date().toLocaleString('pl-PL', { timeZone: tz });
        await this.pollBleBox()
        .then( result =>
        {
          this.setSettings(
            {
              last_poll: date
            });
        })
        .catch(error => {
          this.setUnavailable();
          this.log(error);
        })
      }
      if(this.getAvailable())
        await delay(this.getSetting('poll_interval'));
      else
        await delay(60000);
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

module.exports = BleBoxDevice;
