'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class switchBoxDDevice extends BleBoxMDNSDevice {

  async onBleBoxInit()
  {
    this.registerCapabilityListener('onoff.relay1', this.onCapabilityOnoff1.bind(this));
		this.registerCapabilityListener('onoff.relay2', this.onCapabilityOnoff2.bind(this));
  }

  async pollBleBox() 
	{
    // Read the device state
    await this.bbApi.switchBoxDGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(result => {
      // On success - update Homey's device state
      let state1 = result.relays[0].state==1 ? true : false;
      let state2 = result.relays[1].state==1 ? true : false;
      
      if (state1 != this.getCapabilityValue('onoff.relay1')) {
        this.setCapabilityValue('onoff.relay1', state1)
          .catch( err => {
            this.log(err);
          })   
      }

      if (state2 != this.getCapabilityValue('onoff.relay2')) {
        this.setCapabilityValue('onoff.relay2', state2)
          .catch( err => {
            this.polling = false;
            this.log(err);
          })   
      }
    })
    .catch(error => {
      this.log(error);
    })
	}

  /**
     * Send the state to the relay 1
     */
  async onCapabilityOnoff1( value, opts ) 
  {
    await this.bbApi.switchBoxDSetState(this.getSetting('address'),0,value)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
    });
  }

  /**
   * Send the state to the relay 2
   */
  async onCapabilityOnoff2( value, opts ) 
  {
    await this.bbApi.switchBoxDSetState(this.getSetting('address'),1,value)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
    });
  }

  async setRelay(rNum,Val)
  {
    await this.bbApi.switchBoxDSetState(this.getSetting('address'),rNum,Val)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
    });
  }

  async toggleRelay(rNum)
  {
    await this.bbApi.switchBoxDToggle(this.getSetting('address'),rNum)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
    });
  }

  isRelayOn(relNum)
  {
    if(relNum==0)
      return this.getCapabilityValue('onoff.relay1')
    else
      return this.getCapabilityValue('onoff.relay2')
  }
}

module.exports = switchBoxDDevice;
