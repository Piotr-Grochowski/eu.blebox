const Homey = require('homey');
const BleBoxAPI = require('/lib/bleboxapi.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = class saunaBoxDevice extends Homey.Device {

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
		this.registerCapabilityListener('target_temperature', this.onCapabilityTargetTemperature.bind(this));

		await this.bbApi.getDeviceState(this.getSetting('address'))
		.then(result => {
			if(result.type=='saunaBox' && result.id==this.getData().id)
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
			await this.bbApi.saunaBoxGetState(this.getSetting('address'),this.getSetting('apiLevel'))
			.then(result => {
        		// On success - update Homey's device state
				this.setAvailable();

				if (result.heat.desiredTemp/100 != this.getCapabilityValue('target_temperature')) {
					this.setCapabilityValue('target_temperature', result.heat.desiredTemp/100)
						.catch( err => {
              				this.polling = false;
							this.error(err);
						})   
				}

        		const state = result.heat.state == 0 ? false : true;

				if (state != this.getCapabilityValue('onoff')) {
					this.setCapabilityValue('onoff', state)
						.catch( err => {
             				this.polling = false;
							this.error(err);
						})   
				}
        
				result.heat.sensors.forEach(element => {
					if(element.type=='temperature')
            			this.setCapabilityValue('measure_temperature', element.value / 100)
					  	.catch( err => {
              				this.polling = false;
						  	this.error(err);
					  });
				});


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
				if(result.type=='saunaBox' && result.id==this.getData().id)
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

      await this.bbApi.thermoBoxSetState(this.getSetting('address'),value)
          .catch(error => {
            // Error occured
            // Set the device as unavailable
            this.log(error);
            this.polling = false;
            this.pinging = true;
            this.emit('ping');
          })
  	}
	  
  /**
   * Send the target temperature
   */
async onCapabilityTargetTemperature( value, opts ) 
{
    await this.bbApi.thermoBoxSetTargetTemperature(this.getSetting('address'),value)
    .catch(error => {
      // Error occured
      // Set the device as unavailable
      this.log(error);
      this.polling = false;
      this.pinging = true;
      this.emit('ping');
    })
}  
}