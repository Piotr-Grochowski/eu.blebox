'use strict'; 

const { Device } = require('homey');
const BleBoxAPI = require('/lib/bleboxapi.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class shutterBoxDevice extends Device {

  /**
   * device init
   */
  async onInit() 
  {
    this.bbApi = new BleBoxAPI();
    this.polling = false;

    this.addListener('poll', this.pollDevice);
 
    // register a capability listener
		this.registerCapabilityListener('windowcoverings_state', this.onCapabilityState.bind(this));
		this.registerCapabilityListener('windowcoverings_set', this.onCapabilityPositionSet.bind(this));
		this.registerCapabilityListener('windowcoverings_closed', this.onCapabilityClosed.bind(this));
		this.registerCapabilityListener('favorite_position_button', this.onCapabilityButton.bind(this));
/* 
    await this.bbApi.shutterBoxGetExtendedState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(result => {
      if(result.shutter.controlType!=3)
        this.removeCapability('windowcoverings_tilt_set');
      else */
        this.registerCapabilityListener('windowcoverings_tilt_set', this.onCapabilityTiltSet.bind(this));
/*
    })
    .catch(error => {
      console.log(error);
      this.error(error);
      return;
    })
*/
    this.log('shutterBox '.concat(this.getName(), ' has been initialized'));
  }

  /**
  * if the discovered device is this device - return true
  */
  onDiscoveryResult(discoveryResult) 
  {
    return discoveryResult.id === this.getData().id;
  }
 
  /**
   * This method will be executed once when the device has been found (onDiscoveryResult returned true)
   */
  async onDiscoveryAvailable(discoveryResult) 
  {
    this.emit('poll');
  }

  /**
   * Update the address and reconnect
   */
  onDiscoveryAddressChanged(discoveryResult) 
  {
    this.setSettings(
      {
        address: discoveryResult.address
      });
 
    this.emit('poll');
  }

  /**
   * When device was offline and shows up again - reconnect
   */
  onDiscoveryLastSeenChanged(discoveryResult) 
  {
    this.emit('poll');
  }
 
  /**
   * polling to get the current state and energy values
   */
  async pollDevice() 
  {
    if(this.polling) return;
    this.polling = true;

    // First check current device settings (which may change e.g. after firmware upgrade)
    await this.bbApi.getDeviceState(this.getSetting('address'))
    .then(result => {
      this.setSettings(
        {
          product: result.product,
          hv: result.hv,
          fv: result.fv,
          apiLevel: result.apiLevel
        }
      )
    })
    .catch(error => {
      this.polling = false;
      console.log(error);
      this.error(error);
      return;
    })
 
    while (this.getAvailable() && this.polling) {
      // Read the device state
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
              this.polling = false;
							this.error(err);
						})
				}
	
				if (shutter_closed != this.getCapabilityValue('windowcoverings_closed')) {
					this.setCapabilityValue('windowcoverings_closed', shutter_closed)
						.catch( err => {
              this.polling = false;
							this.error(err);
						})
				}
	
				if (shutter_position != this.getCapabilityValue('windowcoverings_set')) {
					this.setCapabilityValue('windowcoverings_set', shutter_position)
						.catch( err => {
              this.polling = false;
							this.error(err);
						})
				}
	
				if (shutter_tilt != this.getCapabilityValue('windowcoverings_tilt_set')) {
					this.setCapabilityValue('windowcoverings_tilt_set', shutter_tilt)
						.catch( err => {
              this.polling = false;
							this.error(err);
						})
				}
      })
      .catch(error => {
        this.polling = false;
        console.log(error);
        this.error(error);
        return;
      })
      
      await delay(this.getSetting('poll_interval'));
    }  
    this.polling = false;
  }
  
	// this method is called when the Device has requested a state change (turned up or down)
	async onCapabilityState( value, opts ) 
  {
    this.bbApi.shutterBoxSetState(this.getSetting('address'), value)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
      
    });
  }

	// this method is called by Move To Favourite Position Flow Action Card
	async moveToFavPos() 
  {
    this.bbApi.shutterBoxSetFavPos(this.getSetting('address'))
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

    this.bbApi.shutterBoxSetPosition(this.getSetting('address'), posValue)
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

    this.bbApi.shutterBoxSetState(this.getSetting('address'), state)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
      
    });
  }

	// this method is called when the Device has requested a state change (favourite position button pressed)
	async onCapabilityButton( value, opts ) {

    this.bbApi.shutterBoxSetFavPos(this.getSetting('address'))
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
      
    });
	}

	// this method is called when the Device has requested a tilt change
	async onCapabilityTiltSet( value, opts ) {

		// Tilt
		const tiltValue = Math.round(value*100).toString();

    this.bbApi.shutterBoxSetTilt(this.getSetting('address'), tiltValue)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
      
    });
	}

 
  async onDeleted()
  {
   this.polling = false;
  }



}

module.exports = shutterBoxDevice;
