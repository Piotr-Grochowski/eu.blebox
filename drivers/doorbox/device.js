'use strict';

const { Device } = require('homey');
const BleBoxAPI = require('/lib/bleboxapi.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class doorBoxDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.setAvailable();
    this.bbApi = new BleBoxAPI();

		// register a capability listener
		this.registerCapabilityListener('button', this.onCapabilityButton.bind(this));

    this.log('doorBox '.concat(this.getName(), ' has been initialized'));
  }
 
  /**
   * Send the state to the device
   */
	async onCapabilityButton( value, opts ) 
  {
    await this.bbApi.gateBoxPrimaryButton(this.getSetting('address'),this.getSetting('username'),this.getSetting('password'));
  }
 
}

module.exports = doorBoxDevice;
