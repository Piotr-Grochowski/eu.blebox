'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class gateBoxDevice extends BleBoxMDNSDevice {

  async onBleBoxInit()
  {
    this.registerCapabilityListener('button', this.onCapabilityButton.bind(this));
  }

  async pollBleBox() 
	{
    await this.bbApi.gateBoxGetState(this.getSetting('address'), this.getSetting('apiLevel'),this.getSetting('username'),this.getSetting('password'))
    .then(result => {
        // On success - update Homey's device state
        let state = false;
        if(result.gate.currentPos!=0) state = true;
        
        if (state != this.getCapabilityValue('alarm_contact')) {
            this.setCapabilityValue('alarm_contact', state)
                .catch( err => {
                    this.log(err);
                })
        }
    })
    .catch(error => {
      this.log(error);
    })
	}

  /**
   * Send the state to the device
   */
	async onCapabilityButton( value, opts ) 
  {
    this.bbApi.gateBoxPrimaryButton(this.getSetting('address'),this.getSetting('username'),this.getSetting('password'))
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
    });
  }
}
 
module.exports = gateBoxDevice;
