const Homey = require('homey');
const BleBoxAPI = require('../../lib/bleboxapi.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = class dimmerBoxDevice extends Homey.Device {

	// Device init
	async onInit() {
    	this.bbApi = new BleBoxAPI();

		this.setAvailable();
		
		this.polling = true;
		this.pinging = false;

		this.addListener('poll', this.pollDevice);
		this.addListener('ping', this.pingDevice);

		// Stores last Dim Level > 0. In the beginning it's 100%
		this.previousDimLevel = 100;

		// register capability listeners
		this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
		this.registerCapabilityListener('dim', this.onCapabilityDim.bind(this));

		await this.bbApi.getDeviceState(this.getSetting('address'))
		.then(result => {
			if(result.type=='dimmerBox' && result.id==this.getData().id)
			{
				this.setSettings({
					product: result.type,
          			apilevel: result.apilevel,
					hv: result.hv,
					fv: result.fv
				});
				this.polling = true;
				this.pinging = false;
						
				// Enable device polling
				this.emit('poll');
			}
			else
			{
				this.log('Device is not reachable, pinging every 60 seconds to see if it comes online again.');
				this.polling = false;
				this.pinging = true;

				// Enable device pinging
				this.emit('ping');
			}

		})
		.catch(error => {
			this.log('Device is not reachable, pinging every 60 seconds to see if it comes online again.');
			this.polling = false;
			this.pinging = true;
			// Enable device pinging
			this.emit('ping');
		})
	}

	async pollDevice() 
	{
		while (this.polling && !this.pinging) {
			await this.bbApi.dimmerBoxGetState(this.getSetting('address'),this.getSetting('apiLevel'))
			.then(result => {
				// On success - update Homey's device state
				this.setAvailable();
				let brightness = Math.round(result.dimmer.desiredBrightness/255*100)/100;
				let onState = false;
				if(brightness>0)
				{
					this.previousDimLevel = brightness;
					onState = true;
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
				this.pinging = true;
				this.emit('ping');
				return;
			});					
			await delay(this.getSetting('poll_interval'));
		}  
    }

	async pingDevice() 
	{
		while (!this.polling && this.pinging) {
			this.setUnavailable();
			await this.bbApi.getDeviceState(this.getSetting('address'))
			.then(result => {
				if(result.type=='dimmerBox' && result.id==this.getData().id)
				{
					this.setAvailable();
					this.polling = true;
					this.pinging = false;
					this.emit('poll');
					return;
				}
			})
			.catch(error => {
				this.log('Device is not reachable, pinging every 60 seconds to see if it comes online again.');
			})
			await delay(60000);
		}
	}

	// Cancel pooling when device is deleted
	async onDeleted() {
		this.polling = false;
		this.pinging = false;
	}

	// this method is called when the Device has requested a state change (turned on or off)
	async onCapabilityOnoff( value, opts ) {

        if(value==true)
        {
			var hexBrightness = Math.round(this.previousDimLevel*255).toString(16);
			if(this.getSetting('dimOn') != 'previous' )
			{
				hexBrightness = Math.round(this.getSetting('dimOn')*255/100).toString(16);
			}

			if(hexBrightness.length==1) hexBrightness='0'+hexBrightness;

			// Turn on the device
			await this.bbApi.dimmerBoxSetState(this.getSetting('address'),hexBrightness)
			.catch(error => {
				// Error occured
				// Set the device as unavailable
				this.log(error);
				this.polling = false;
				this.pinging = true;
				this.emit('ping');
			})
		}
        else
        {
			// Turn off the device
			await this.bbApi.dimmerBoxSetState(this.getSetting('address'),'00')
			.catch(error => {
				this.log(error);
				// Error occured
				// Set the device as unavailable
				this.polling = false;
				this.pinging = true;
				this.emit('ping');

			})
		}
	}

	// this method is called when the Device has requested a state change (turned on or off)
	async onCapabilityDim( value, opts ) {

		let hexBrightness = Math.round(value*255).toString(16);

		if(hexBrightness.length==1) hexBrightness='0'+hexBrightness;

		// Dim the device
    await this.bbApi.dimmerBoxSetState(this.getSetting('address'),hexBrightness)
		.catch(error => {
			// Error occured
			// Set the device as unavailable
			this.polling = false;
			this.pinging = true;
			this.emit('ping');
		})
	}
}