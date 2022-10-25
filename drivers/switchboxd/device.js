'use strict';

const { Device } = require('homey');
const BleBoxAPI = require('/lib/bleboxapi.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class switchBoxDDevice extends Device {

  /**
   * device init
   */
  async onInit() 
  {
    this.bbApi = new BleBoxAPI();
    this.polling = false;
    this.addListener('poll', this.pollDevice);

		// register a capability listener
		this.registerCapabilityListener('onoff.relay1', this.onCapabilityOnoff1.bind(this));
		this.registerCapabilityListener('onoff.relay2', this.onCapabilityOnoff2.bind(this));

    this.log('switchBoxD '.concat(this.getName(), ' has been initialized'));
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
    this.emit('poll');
  }

  /**
   * Update the address and reconnect
   */
   onDiscoveryAddressChanged(discoveryResult) 
  {
    this.setSettings(
      {
        address: discoveryResult.address
      });

    this.emit('poll');
  }

  /**
   * When device was offline and shows up again - reconnect
   */
   onDiscoveryLastSeenChanged(discoveryResult) 
  {
    this.emit('poll');
  }

  /**
   * polling to get the current state and energy values
   */
  async pollDevice() 
	{
    if(this.polling) return;
    this.polling = true;
   // First check current device settings (which may change e.g. after firmware upgrade)
    await this.bbApi.getDeviceState(this.getSetting('address'))
    .then(result => {
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
      this.polling = false;
      console.log(error);
      this.error(error);
      return;
    })

		while (this.getAvailable() && this.polling) {
			// Read the device state
			await this.bbApi.switchBoxDGetState(this.getSetting('address'), this.getSetting('apiLevel'))
			.then(result => {
				// On success - update Homey's device state
        let state1 = result.relays[0].state==1 ? true : false;
        let state2 = result.relays[1].state==1 ? true : false;
				
				if (state1 != this.getCapabilityValue('onoff.relay1')) {
					this.setCapabilityValue('onoff.relay1', state1)
						.catch( err => {
              this.polling = false;
							this.error(err);
						})   
				}

				if (state2 != this.getCapabilityValue('onoff.relay2')) {
					this.setCapabilityValue('onoff.relay2', state2)
						.catch( err => {
              this.polling = false;
							this.error(err);
						})   
				}

			})
			.catch(error => {
        this.polling = false;
				console.log(error);
        this.error(error);
				return;
			})
			await delay(this.getSetting('poll_interval'));
		}  
    this.polling = false;
	}

  /**
   * Send the state to the relay 1
   */
	async onCapabilityOnoff1( value, opts ) 
  {
    await this.bbApi.switchBoxDSetState(this.getSetting('address'),0,value);
  }

  /**
   * Send the state to the relay 2
   */
   async onCapabilityOnoff2( value, opts ) 
   {
     await this.bbApi.switchBoxDSetState(this.getSetting('address'),1,value);
   }
 
 
   async onDeleted()
   {
    this.polling = false;
   }


}

module.exports = switchBoxDDevice;
