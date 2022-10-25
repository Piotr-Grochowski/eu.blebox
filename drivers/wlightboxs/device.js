'use strict';

const { Device } = require('homey');
const BleBoxAPI = require('/lib/bleboxapi.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class wLightBoxSDevice extends Device {

  /**
   * device init
   */
  async onInit() 
  {
    this.bbApi = new BleBoxAPI();
    this.polling = false;
    this.addListener('poll', this.pollDevice);

		// register a capability listener
		this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
		this.registerCapabilityListener('dim', this.onCapabilityDim.bind(this));

    this.log('wLightBoxS '.concat(this.getName(), ' has been initialized'));
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
			await this.bbApi.wLightBoxGetState(this.getSetting('address'), this.getSetting('apiLevel'))
			.then(result => {
				const brightness = Math.round(parseInt(result.rgbw.desiredColor,16)/255*100)/100;
				const onState = brightness > 0 ? true : false;
				if(brightness>0)
				{
					this.previousDimLevel = brightness;
				}
				if (brightness != this.getCapabilityValue('dim')) {
					this.setCapabilityValue('dim', brightness)
						.catch( err => {
							this.error(err);
						})
				}
	
				if (onState != this.getCapabilityValue('onoff')) {
					this.setCapabilityValue('onoff', onState)
						.catch( err => {
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
   * Send the state to the device
   */
	async onCapabilityOnoff( value, opts ) 
  {
    if(value==true)
    {
      const hexBrightness = this.getSetting('dimOn') != 'previous' ? Math.round(this.getSetting('dimOn')*255/100).toString(16) : 
                               Math.round(this.previousDimLevel*255).toString(16);
      // Turn on the device
      await this.bbApi.wLightBoxSetState(this.getSetting('address'),hexBrightness)
      .catch(error => {
        this.log(error);
      })
    }
    else
    {
      // Turn off the device
      await this.bbApi.wLightBoxSetState(this.getSetting('address'),'00')
      .catch(error => {
        this.log(error);
      })
    }
  }

	// this method is called when the Device has requested a state change (turned on or off)
	async onCapabilityDim( value, opts ) {

		let hexBrightness = Math.round(value*255).toString(16);
		if(value*255<16) hexBrightness = "0"+hexBrightness;
		// Dim the device
    await this.bbApi.wLightBoxSetState(this.getSetting('address'),hexBrightness)
		.catch(error => {
				// Error occured
				this.log(error);
		})
	}


  async onDeleted()
  {
   this.polling = false;
  }


}


module.exports = wLightBoxSDevice;
