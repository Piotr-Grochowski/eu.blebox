const Homey = require('homey');
const BleBoxAPI = require('../../lib/bleboxapi.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = class rollerGateDevice extends Homey.Device {

	// Device init
	async onInit() {
    	this.bbApi = new BleBoxAPI();

		this.setAvailable();
		
		this.polling = true;
		this.pinging = false;

		this.addListener('poll', this.pollDevice);
		this.addListener('ping', this.pingDevice);


		// register capability listeners
		this.registerCapabilityListener('windowcoverings_state', this.onCapabilityState.bind(this));
		this.registerCapabilityListener('windowcoverings_set', this.onCapabilityPositionSet.bind(this));
		this.registerCapabilityListener('garagedoor_closed', this.onCapabilityClosed.bind(this));

		await this.bbApi.getDeviceState(this.getSetting('address'))
		.then(result => {
			if(result.type=='gateController' && result.id==this.getData().id)
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
			// Read the device state
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

	// this method is called when the Device has requested a state change (turned up or down)
	async onCapabilityState( value, opts ) 
  {
    this.bbApi.gateControllerSetState(this.getSetting('address'), value)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
    });
  }

	// this method is called when the Device has requested a position change
	async onCapabilityPositionSet( value, opts ) {

		// Change position
		const posValue = this.getSetting('direction_swap') ? Math.round((1.00-value)*100).toString() : Math.round(value*100).toString();

    this.bbApi.gateControllerSetPosition(this.getSetting('address'), posValue)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
      
    });
	}

	// this method is called when the Device has requested to close
	async onCapabilityClosed( value, opts ) {
    const state = value ? 'down' : 'up';

    this.bbApi.gateControllerSetState(this.getSetting('address'), state)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
      
    });
  }


}
