'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class switchBoxDevice extends BleBoxMDNSDevice {

  async onBleBoxInit()
  {
		this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
  }

  async pollBleBox() 
	{
    // Read the device state
    await this.bbApi.switchBoxGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(result => {
      // On success - update Homey's device state
      let state = result.relays[0].state==1 ? true : false;
      
      if (state != this.getCapabilityValue('onoff')) {
        this.setCapabilityValue('onoff', state)
          .catch( err => {
            this.log(err);
          })   
      }
      if(result.hasOwnProperty('powerMeasuring') && result.powerMeasuring.enabled==1)
      {
        this.setCapabilityValue('meter_power',result.powerMeasuring.powerConsumption[0].value);
        if(result.sensors[0].type=='activePower')
          this.setCapabilityValue('measure_power',result.sensors[0].value);
      }

    })
    .catch(error => {
      this.log(error);
    })
	}

  /**
   * Send the state to the device
   */
	async onCapabilityOnoff( value, opts ) 
  {
    this.bbApi.switchBoxSetState(this.getSetting('address'),value)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
    });
  }

}

module.exports = switchBoxDevice;
