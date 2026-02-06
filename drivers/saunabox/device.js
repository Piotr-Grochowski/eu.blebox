'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

module.exports = class saunaBoxDevice extends BleBoxDevice {

	// Device init
	async onBleBoxInit() {
		this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
		this.registerCapabilityListener('target_temperature', this.onCapabilityTargetTemperature.bind(this));
	}

	async pollBleBox() 
	{
		await this.bbApi.saunaBoxGetState(this.getSetting('address'),this.getSetting('apiLevel'))
		.then(result => {
			// On success - update Homey's device state

			if (result.heat.desiredTemp/100 != this.getCapabilityValue('target_temperature')) {
				this.setCapabilityValue('target_temperature', result.heat.desiredTemp/100)
					.catch( err => {
						this.log(err);
					})   
			}

			const state = result.heat.state == 0 ? false : true;

			if (state != this.getCapabilityValue('onoff')) {
				this.setCapabilityValue('onoff', state)
					.catch( err => {
						this.log(err);
					})   
			}
	
			result.heat.sensors.forEach(element => {
				if(element.type=='temperature')
					this.setCapabilityValue('measure_temperature', element.value / 100)
					.catch( err => {
						this.log(err);
					});
			});

		})
		.catch(error => {
			this.log(error);
		});					
  	}

	// this method is called when the Device has requested a state change (turned on or off)
	async onCapabilityOnoff( value, opts ) 
	{
    	await this.bbApi.thermoBoxSetState(this.getSetting('address'),(value ? 1 : 0))
        .catch(error => {
            this.log(error);
        })
  	}
	  
	async onCapabilityTargetTemperature( value, opts ) 
	{
		await this.bbApi.thermoBoxSetTargetTemperature(this.getSetting('address'),value)
		.catch(error => {
			this.log(error);
		})
	}  
}