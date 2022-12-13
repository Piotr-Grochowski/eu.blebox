const Homey = require('homey');
const util = require('/lib/util.js');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = class shutterBoxDCDevice extends Homey.Device {

	// Device init
	onInit() {
        this.bbApi = new BleBoxAPI();

		this.setAvailable();

		this.polling = true;
		this.pinging = false;

		this.addListener('poll', this.pollDevice);
		this.addListener('ping', this.pingDevice);

		// register a capability listener
		this.registerCapabilityListener('windowcoverings_state', this.onCapabilityState.bind(this));
		this.registerCapabilityListener('windowcoverings_set', this.onCapabilityPositionSet.bind(this));
		this.registerCapabilityListener('windowcoverings_closed', this.onCapabilityClosed.bind(this));
		this.registerCapabilityListener('favorite_position_button', this.onCapabilityButton.bind(this));

        this.log('shutterBoxDC '.concat(this.getName(), ' has been initialized'));

		// Enable device polling
		this.emit('poll');
	}

	async pollDevice() 
	{
		while (this.polling && !this.pinging) {
            await this.bbApi.shutterBoxGetState(this.getSetting('address'), this.getSetting('apiLevel'))
            .then(result => {
              // On success - update Homey's device state
              const shutter_position = this.getSetting('direction_swap') ? 1.00 - result.shutter.desiredPos.position/100 : result.shutter.desiredPos.position/100; 
              const shutter_tilt = result.shutter.desiredPos.tilt/100;
              const shutter_closed = result.shutter.state == 3 ? true : false;
              let shutter_state = 'idle';
              if(result.shutter.state == 1) shutter_state = 'up';
              if(result.shutter.state == 0) shutter_state = 'down';
              
              if (shutter_state != this.getCapabilityValue('windowcoverings_state')) {
                          this.setCapabilityValue('windowcoverings_state', shutter_state)
                              .catch( err => {
                                  this.error(err);
                              })
                      }
          
                      if (shutter_closed != this.getCapabilityValue('windowcoverings_closed')) {
                          this.setCapabilityValue('windowcoverings_closed', shutter_closed)
                              .catch( err => {
                                  this.error(err);
                              })
                      }
          
                      if (shutter_position != this.getCapabilityValue('windowcoverings_set')) {
                          this.setCapabilityValue('windowcoverings_set', shutter_position)
                              .catch( err => {
                                  this.error(err);
                              })
                      }
          
                      if (shutter_tilt != this.getCapabilityValue('windowcoverings_tilt_set')) {
                          this.setCapabilityValue('windowcoverings_tilt_set', shutter_tilt)
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
			await util.sendGetCommand('/api/device/state',this.getSetting('address'))
			.then(result => {
				if(result.device.type=='shutterBox' && result.device.id==this.getData().id)
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
	onDeleted() {
		this.polling = false;
		this.pinging = false;
	}

	// this method is called when the Device has requested a state change (turned up or down)
	async onCapabilityState( value, opts ) {

        this.bbApi.shutterBoxSetState(this.getSetting('address'), value)
        .catch(error => {
				// Error occured
				// Set the device as unavailable
				this.log(error);
				this.polling = false;
				this.pinging = true;
				this.emit('ping');
			})
	}


	// this method is called when the Device has requested a tilt change
	async onCapabilityTiltSet( value, opts ) {

		// Tilt
		const tiltValue = Math.round(value*100).toString();

        this.bbApi.shutterBoxSetTilt(this.getSetting('address'), tiltValue)
		.catch(error => {
			// Error occured
			// Set the device as unavailable
			this.log(error);
			this.polling = false;
			this.pinging = true;
			this.emit('ping');
		})

	}

	// this method is called when the Device has requested a position change
	async onCapabilityPositionSet( value, opts ) {

		// Change position
		const posValue = this.getSetting('direction_swap') ? Math.round((1.00-value)*100).toString() : Math.round(value*100).toString();

        this.bbApi.shutterBoxSetPosition(this.getSetting('address'), posValue)
		.catch(error => {
			// Error occured
			// Set the device as unavailable
			this.log(error);
			this.polling = false;
			this.pinging = true;
			this.emit('ping');
		})

	}

	// this method is called when the Device has requested to close
	async onCapabilityClosed( value, opts ) {
        const state = value ? 'down' : 'up';

        this.bbApi.shutterBoxSetState(this.getSetting('address'), state)
        .catch(error => {
            // Error occured
            // Set the device as unavailable
            this.log(error);
            this.polling = false;
            this.pinging = true;
            this.emit('ping');
        })

	}

	// this method is called when the Device has requested a state change (button pressed)
	async onCapabilityButton( value, opts ) {

		// send a command to primary output
        this.bbApi.shutterBoxSetFavPos(this.getSetting('address'))
		.catch(error => {
				// Error occured
				// Set the device as unavailable
				this.log(error);
				this.pinging = true;
				this.emit('ping');
		})
	}
	
}