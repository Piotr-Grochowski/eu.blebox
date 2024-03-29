'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class wLightBoxDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
      this.bleBoxType = 'wLightBox';
      this.bleBoxProduct = 'wLightBox';
      this.bleBoxPoll = 1000;

      const dimWhiteAction = this.homey.flow.getActionCard('dim_white');
      const dimRedAction = this.homey.flow.getActionCard('dim_red');
      const dimGreenAction = this.homey.flow.getActionCard('dim_green');
      const dimBlueAction = this.homey.flow.getActionCard('dim_blue');
      const setChannelsAction = this.homey.flow.getActionCard('set_channels');
      const setEffectAction = this.homey.flow.getActionCard('wlightbox_set_effect');
		
		dimWhiteAction.registerRunListener(async ( args, state ) => {
      await args.device.dimWhiteTo(args.brightness);		
		});

		dimRedAction.registerRunListener(async ( args, state ) => {
      await args.device.dimRedTo(args.brightness);
		});

		dimGreenAction.registerRunListener(async ( args, state ) => {
      await args.device.dimGreenTo(args.brightness);
		});

      dimBlueAction.registerRunListener(async ( args, state ) => {
      await args.device.dimBlueTo(args.brightness);
		});

		setChannelsAction.registerRunListener(async ( args, state ) => {
         await args.device.changeChannelsTo(args.red_channel, args.green_channel, args.blue_channel, args.white_channel);
		});

		setEffectAction.registerRunListener(async ( args, state ) => {
         await args.device.changeEffectTo(args.effID);
         });
   
      this.log('wLightBoxDriver has been initialized');
  }

}

module.exports = wLightBoxDriver;
