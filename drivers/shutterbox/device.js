'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class shutterBoxDevice extends BleBoxMDNSDevice {

  async onBleBoxInit()
  {
		this.registerCapabilityListener('windowcoverings_state', this.onCapabilityState.bind(this));
		this.registerCapabilityListener('windowcoverings_set', this.onCapabilityPositionSet.bind(this));
		this.registerCapabilityListener('windowcoverings_closed', this.onCapabilityClosed.bind(this));
		this.registerCapabilityListener('favorite_position_button', this.onCapabilityButton.bind(this));
    this.registerCapabilityListener('windowcoverings_tilt_set', this.onCapabilityTiltSet.bind(this));

  }

  async pollBleBox() 
	{
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
            this.log(err);
          })
      }

      if (shutter_closed != this.getCapabilityValue('windowcoverings_closed')) {
        this.setCapabilityValue('windowcoverings_closed', shutter_closed)
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

      if (shutter_tilt != this.getCapabilityValue('windowcoverings_tilt_set')) {
        this.setCapabilityValue('windowcoverings_tilt_set', shutter_tilt)
          .catch( err => {
            this.log(err);
          })
      }
    })
    .catch(error => {
      this.log(error);
    })
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


}
 
module.exports = shutterBoxDevice;
