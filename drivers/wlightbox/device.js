'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

class wLightBoxDevice extends BleBoxDevice {

  async onBleBoxInit()
  {
    // Backward compatibility - add "effect_selector" capability if not exists
    if (!this.hasCapability('effect_selector')) 
      this.addCapability('effect_selector');

		this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
		this.registerCapabilityListener('dim.channelR', this.onCapabilityChannelR.bind(this));
		this.registerCapabilityListener('dim.channelG', this.onCapabilityChannelG.bind(this));
		this.registerCapabilityListener('dim.channelB', this.onCapabilityChannelB.bind(this));
		this.registerCapabilityListener('dim.channelW', this.onCapabilityChannelW.bind(this));
		this.registerCapabilityListener('effect_selector', this.onCapabilityEffectSelector.bind(this));
		this.registerMultipleCapabilityListener(["light_hue","light_saturation","dim.brightness"], this.onCapabilityLightHSB.bind(this));
  }

  async pollBleBox() 
	{
    // Read the device state
    await this.bbApi.wLightBoxGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(result => {
      const levelR = Math.round(parseInt(result.rgbw.desiredColor.substring(0,2),16)/255*100)/100;
      const levelG = Math.round(parseInt(result.rgbw.desiredColor.substring(2,4),16)/255*100)/100;
      const levelB = Math.round(parseInt(result.rgbw.desiredColor.substring(4,6),16)/255*100)/100;
      const levelW = Math.round(parseInt(result.rgbw.desiredColor.substring(6,8),16)/255*100)/100;

      const onState = levelR>0 || levelG>0 || levelB>0 || levelW > 0 ? true : false;

      const channels = rgbToHsv(parseInt(result.rgbw.desiredColor.substring(0,2),16),
                  parseInt(result.rgbw.desiredColor.substring(2,4),16),
                  parseInt(result.rgbw.desiredColor.substring(4,6),16));
      const hue = channels[0];
      const saturation = channels[1];
      const brightness = channels[2];

      if (result.rgbw.effectID.toString() != this.getCapabilityValue('effect_selector')) {
        this.setCapabilityValue('effect_selector', result.rgbw.effectID.toString())
          .catch( err => {
            this.log(err);
          })
      }

      if (levelR != this.getCapabilityValue('dim.channelR')) {
        this.setCapabilityValue('dim.channelR', levelR)
          .catch( err => {
            this.log(err);
          })
      }

      if (levelG != this.getCapabilityValue('dim.channelG')) {
        this.setCapabilityValue('dim.channelG', levelG)
          .catch( err => {
            this.log(err);
          })
      }
      if (levelB != this.getCapabilityValue('dim.channelB')) {
        this.setCapabilityValue('dim.channelB', levelB)
          .catch( err => {
            this.log(err);
          })
      }
      if (levelW != this.getCapabilityValue('dim.channelW')) {
        this.setCapabilityValue('dim.channelW', levelW)
          .catch( err => {
            this.log(err);
          })
      }

      if (brightness != this.getCapabilityValue('dim.brightness')) {
        this.setCapabilityValue('dim.brightness', brightness)
          .catch( err => {
            this.log(err);
          })
      }

      if (hue != this.getCapabilityValue('light_hue')) {
        this.setCapabilityValue('light_hue', hue)
          .catch( err => {
            this.log(err);
          })
      }

      if (saturation != this.getCapabilityValue('light_saturation')) {
        this.setCapabilityValue('light_saturation', saturation)
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

  /**
   * Send the state to the device
   */
  async onCapabilityOnoff( value, opts ) 
  {
    if(value==true)
    {
      // Turn on the device
      await this.bbApi.wLightBoxSetState(this.getSetting('address'),this.getSetting("on_value"))
      .catch(error => {
        this.log(error);
      })
    }
    else
    {
      // Turn off the device
      await this.bbApi.wLightBoxSetState(this.getSetting('address'),'00000000')
      .catch(error => {
        this.log(error);
      })
    }
  }


  // this method is called when the Device has requested a state change on hue or saturation
  async onCapabilityLightHSB( value, opts ) {
    const hue_value = typeof value.light_hue !== 'undefined' ? value.light_hue : this.getCapabilityValue('light_hue');
    const saturation_value = typeof value.light_saturation !== 'undefined' ? value.light_saturation : this.getCapabilityValue('light_saturation');
    const dim_value = typeof value["dim.brightness"] !== 'undefined' ? value["dim.brightness"] : this.getCapabilityValue('dim.brightness');
    
    const channels = hsvToRgb(Math.round(hue_value*360), Math.round(saturation_value*100),Math.round(dim_value*100));

    var hexChannelR = channels[0].toString(16);
    var hexChannelG = channels[1].toString(16);
    var hexChannelB = channels[2].toString(16);
    var hexChannelW = Math.round(this.getCapabilityValue('dim.channelW')*255).toString(16);
    
    if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
    if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
    if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
    if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

    // Change the color
    await this.bbApi.wLightBoxSetState(this.getSetting('address'),hexChannelR+hexChannelG+hexChannelB+hexChannelW)
    .catch(error => {
      this.log(error);
    })
  }

  // this method is called when the Device has requested a state change on channel R
  async onCapabilityChannelR( value, opts ) {
    var hexChannelR = Math.round(value*255).toString(16);
    var hexChannelG = Math.round(this.getCapabilityValue('dim.channelG')*255).toString(16);
    var hexChannelB = Math.round(this.getCapabilityValue('dim.channelB')*255).toString(16);
    var hexChannelW = Math.round(this.getCapabilityValue('dim.channelW')*255).toString(16);
    
    if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
    if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
    if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
    if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

    // Change the color
    await this.bbApi.wLightBoxSetState(this.getSetting('address'),hexChannelR+hexChannelG+hexChannelB+hexChannelW)
    .catch(error => {
      this.log(error);
    })
  }

  // this method is called when the Device has requested a state change on channel G
  async onCapabilityChannelG( value, opts ) {
    var hexChannelR = Math.round(this.getCapabilityValue('dim.channelR')*255).toString(16);
    var hexChannelG = Math.round(value*255).toString(16);
    var hexChannelB = Math.round(this.getCapabilityValue('dim.channelB')*255).toString(16);
    var hexChannelW = Math.round(this.getCapabilityValue('dim.channelW')*255).toString(16);

    if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
    if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
    if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
    if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

    // Change the color
    await this.bbApi.wLightBoxSetState(this.getSetting('address'),hexChannelR+hexChannelG+hexChannelB+hexChannelW)
    .catch(error => {
      this.log(error);
    })
  }

  // this method is called when the Device has requested a state change on channel B
  async onCapabilityChannelB( value, opts ) {
    var hexChannelR = Math.round(this.getCapabilityValue('dim.channelR')*255).toString(16);
    var hexChannelG = Math.round(this.getCapabilityValue('dim.channelG')*255).toString(16);
    var hexChannelB = Math.round(value*255).toString(16);
    var hexChannelW = Math.round(this.getCapabilityValue('dim.channelW')*255).toString(16);
    
    if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
    if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
    if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
    if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

    // Change the color
    await this.bbApi.wLightBoxSetState(this.getSetting('address'),hexChannelR+hexChannelG+hexChannelB+hexChannelW)
    .catch(error => {
      this.log(error);
    })
  }

  // this method is called when the Device has requested a state change on channel W
  async onCapabilityChannelW( value, opts ) {
    var hexChannelR = Math.round(this.getCapabilityValue('dim.channelR')*255).toString(16);
    var hexChannelG = Math.round(this.getCapabilityValue('dim.channelG')*255).toString(16);
    var hexChannelB = Math.round(this.getCapabilityValue('dim.channelB')*255).toString(16);
    var hexChannelW = Math.round(value*255).toString(16);
    
    if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
    if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
    if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
    if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

    // Change the color
    await this.bbApi.wLightBoxSetState(this.getSetting('address'),hexChannelR+hexChannelG+hexChannelB+hexChannelW)
    .catch(error => {
      this.log(error);
    })
  } 

  async onCapabilityEffectSelector( value, opts ) {
    // Change the effect
    await this.bbApi.wLightBoxSetEffect(this.getSetting('address'),value)
    .catch(error => {
      this.log(error);
    })
  }

  async dimRedTo(brightness)
  {
    var hexChannelW = Math.round(this.getCapabilityValue('dim.channelW')*255).toString(16);
    var hexChannelG = Math.round(this.getCapabilityValue('dim.channelG')*255).toString(16);
    var hexChannelB = Math.round(this.getCapabilityValue('dim.channelB')*255).toString(16);
    var hexChannelR = Math.round(brightness*255).toString(16);

    if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
    if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
    if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
    if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

    // Change the color
    await this.bbApi.wLightBoxSetState(this.getSetting('address'), hexChannelR+hexChannelG+hexChannelB+hexChannelW);

  }

  async dimGreenTo(brightness)
  {
    var hexChannelR = Math.round(this.getCapabilityValue('dim.channelR')*255).toString(16);
    var hexChannelW = Math.round(this.getCapabilityValue('dim.channelW')*255).toString(16);
    var hexChannelB = Math.round(this.getCapabilityValue('dim.channelB')*255).toString(16);
    var hexChannelG = Math.round(brightness*255).toString(16);

    if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
    if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
    if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
    if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

    // Change the color
    await this.bbApi.wLightBoxSetState(this.getSetting('address'), hexChannelR+hexChannelG+hexChannelB+hexChannelW);

  }

  async dimBlueTo(brightness)
  {
    var hexChannelR = Math.round(this.getCapabilityValue('dim.channelR')*255).toString(16);
    var hexChannelG = Math.round(this.getCapabilityValue('dim.channelG')*255).toString(16);
    var hexChannelW = Math.round(this.getCapabilityValue('dim.channelW')*255).toString(16);
    var hexChannelB = Math.round(brightness*255).toString(16);

    if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
    if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
    if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
    if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

    // Change the color
    await this.bbApi.wLightBoxSetState(this.getSetting('address'), hexChannelR+hexChannelG+hexChannelB+hexChannelW);

  }

  async dimWhiteTo(brightness)
  {
    var hexChannelR = Math.round(this.getCapabilityValue('dim.channelR')*255).toString(16);
    var hexChannelG = Math.round(this.getCapabilityValue('dim.channelG')*255).toString(16);
    var hexChannelB = Math.round(this.getCapabilityValue('dim.channelB')*255).toString(16);
    var hexChannelW = Math.round(brightness*255).toString(16);

    if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
    if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
    if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
    if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

    // Change the color
    await this.bbApi.wLightBoxSetState(this.getSetting('address'), hexChannelR+hexChannelG+hexChannelB+hexChannelW);

  }

  async changeChannelsTo(red_channel,green_channel,blue_channel,white_channel)
  {
    var hexChannelR = Math.round(red_channel*255).toString(16);
    var hexChannelG = Math.round(green_channel*255).toString(16);
    var hexChannelB = Math.round(blue_channel*255).toString(16);
    var hexChannelW = Math.round(white_channel*255).toString(16);

    if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
    if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
    if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
    if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

    // Change the color
    await this.bbApi.wLightBoxSetState(this.getSetting('address'), hexChannelR+hexChannelG+hexChannelB+hexChannelW);

  }

  async changeEffectTo(effID)
  {
    await this.bbApi.wLightBoxSetEffect(this.getSetting('address'),effID)
    .catch(error => {
      this.log(error);
    })
  }
}

function hsvToRgb(h, s, v) {
  let r, g, b;
  let i;
  let f, p, q, t;

  // Make sure our arguments stay in-range
  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(100, s));
  v = Math.max(0, Math.min(100, v));

  // We accept saturation and value arguments from 0 to 100 because that's
  // how Photoshop represents those values. Internally, however, the
  // saturation and value are calculated from a range of 0 to 1. We make
  // That conversion here.
  s /= 100;
  v /= 100;

  if(s == 0) {
      // Achromatic (grey)
      r = g = b = v;
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  h /= 60; // sector 0 to 5
  i = Math.floor(h);
  f = h - i; // factorial part of h
  p = v * (1 - s);
  q = v * (1 - s * f);
  t = v * (1 - s * (1 - f));

  switch(i) {
      case 0:
          r = v;
          g = t;
          b = p;
          break;

      case 1:
          r = q;
          g = v;
          b = p;
          break;

      case 2:
          r = p;
          g = v;
          b = t;
          break;

      case 3:
          r = p;
          g = q;
          b = v;
          break;

      case 4:
          r = t;
          g = p;
          b = v;
          break;

      default: // case 5:
          r = v;
          g = p;
          b = q;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHsv(r, g, b) {
r /= 255, g /= 255, b /= 255;

let max = Math.max(r, g, b), min = Math.min(r, g, b);
let h, s, v = max;

let d = max - min;
s = max == 0 ? 0 : d / max;

if (max == min) {
  h = 0; // achromatic
} else {
  switch (max) {
  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
  case g: h = (b - r) / d + 2; break;
  case b: h = (r - g) / d + 4; break;
  }

  h /= 6;
}

return [ h, s, v ];
}

module.exports = wLightBoxDevice;
