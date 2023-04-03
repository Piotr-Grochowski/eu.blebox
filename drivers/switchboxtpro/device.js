'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class switchBoxTPRODevice extends BleBoxMDNSDevice {

  async onBleBoxInit()
  {
    this.registerCapabilityListener('onoff.relaypro1', this.onCapabilityOnoff1.bind(this));
		this.registerCapabilityListener('onoff.relaypro2', this.onCapabilityOnoff2.bind(this));
		this.registerCapabilityListener('onoff.relaypro3', this.onCapabilityOnoff3.bind(this));
  }

  async pollBleBox() 
	{
    // Read the device state
    await this.bbApi.switchBoxGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(result => {
      // On success - update Homey's device state
      const state1 = result.relays[0].state==1 ? true : false;
      const state2 = result.relays[1].state==1 ? true : false;
      const state3 = result.relays[2].state==1 ? true : false;
      
      if (state1 != this.getCapabilityValue('onoff.relaypro1')) {
        this.setCapabilityValue('onoff.relaypro1', state1)
          .catch( err => {
            this.log(err);
          })   
      }

      if (state2 != this.getCapabilityValue('onoff.relaypro2')) {
        this.setCapabilityValue('onoff.relaypro2', state1)
          .catch( err => {
            this.log(err);
          })   
      }

      if (state3 != this.getCapabilityValue('onoff.relaypro3')) {
        this.setCapabilityValue('onoff.relaypro3', state1)
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

  /**
   * Send the state to the relay 3
   */
  async onCapabilityOnoff3( value, opts ) 
  {
    await this.bbApi.switchBoxDSetState(this.getSetting('address'),2,value)
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
      return this.getCapabilityValue('onoff.relaydin1')
    else if(relNum==1)
      return this.getCapabilityValue('onoff.relaydin2')
    else
      return this.getCapabilityValue('onoff.relaydin3')
  }
}

module.exports = switchBoxTPRODevice;
