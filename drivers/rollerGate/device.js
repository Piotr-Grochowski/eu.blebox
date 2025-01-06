'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

module.exports = class rollerGateDevice extends BleBoxDevice {

	// Device init
	async onBleBoxInit() {
 		this.registerCapabilityListener('windowcoverings_state', this.onCapabilityState.bind(this));
		this.registerCapabilityListener('windowcoverings_set', this.onCapabilityPositionSet.bind(this));
		this.registerCapabilityListener('garagedoor_closed', this.onCapabilityClosed.bind(this));
	}

	async pollBleBox() 
	{
		await this.bbApi.gateControllerGetState(this.getSetting('address'), this.getSetting('apiLevel'))
		.then(result => {
			// On success - update Homey's device state
			const shutter_position = this.getSetting('direction_swap') ? 1.00 - result.gateController.desiredPos.positions[0]/100 : result.gateController.desiredPos.positions[0]/100; 
			const shutter_closed = result.gateController.state == 3 ? true : false;
			let shutter_state = 'idle';
			if(result.gateController.state == 1) shutter_state = 'up';
			if(result.gateController.state == 0) shutter_state = 'down';
			
			if (shutter_state != this.getCapabilityValue('windowcoverings_state')) {
			this.setCapabilityValue('windowcoverings_state', shutter_state)
				.catch( err => {
				this.log(err);
				})
			}

			if (shutter_closed != this.getCapabilityValue('garagedoor_closed')) {
			this.setCapabilityValue('garagedoor_closed', shutter_closed)
				.catch( err => {
				this.log(err);
				})
			}

			if (shutter_position != this.getCapabilityValue('windowcoverings_set')) {
			this.setCapabilityValue('windowcoverings_set', shutter_position)
				.catch( err => {
				this.log(err);
				})
			}
		})
		.catch(error => {
			this.log(error);
		});					
    }

	// this method is called when the Device has requested a state change (turned up or down)
	async onCapabilityState( value, opts ) 
  	{
		this.bbApi.gateControllerSetState(this.getSetting('address'), value)
		.catch(error => {
			this.log(error);
		});
  	}

	// this method is called when the Device has requested a position change
	async onCapabilityPositionSet( value, opts ) 
	{
		// Change position
		const posValue = this.getSetting('direction_swap') ? Math.round((1.00-value)*100).toString() : Math.round(value*100).toString();

		this.bbApi.gateControllerSetPosition(this.getSetting('address'), posValue)
		.catch(error => {
			this.log(error);
	    });
	}

	// this method is called when the Device has requested to close
	async onCapabilityClosed( value, opts ) 
	{
	    const state = value ? 'down' : 'up';

		this.bbApi.gateControllerSetState(this.getSetting('address'), state)
		.catch(error => {
			this.log(error);
	    });
  }


}
