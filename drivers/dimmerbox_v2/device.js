'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class dimmerBoxV2Device extends BleBoxMDNSDevice {

  async onBleBoxInit()
  {
    this.previousDimLevel = 100;
		this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
		this.registerCapabilityListener('dim', this.onCapabilityDim.bind(this));
  }

  async pollBleBox() 
	{
    await this.bbApi.dimmerBoxGetState(this.getSetting('address'),this.getSetting('apiLevel'))
    .then(result => {
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
            this.log(err);
          })
      }

      if (onState != this.getCapabilityValue('onoff')) {
        this.setCapabilityValue('onoff', onState)
          .catch( err => {
            this.log(err);
          })	
      }
    })
    .catch(error => {
      this.log(error);
    })
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
        this.log(error);
      });
    }
    else
    {
      // Turn off the device
      await this.bbApi.dimmerBoxSetState(this.getSetting('address'),'00')
      .catch(error => {
        // Error occured
        this.log(error);
      });
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
      this.log(error);
    });
}

}

module.exports = dimmerBoxV2Device;
