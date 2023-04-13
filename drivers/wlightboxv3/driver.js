'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class wLightBoxDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
      this.bleBoxType = 'wLightBox';
      this.bleBoxProduct = 'wLightBox_v3';
      this.bleBoxPoll = 1000;

      const dimWWhiteAction = this.homey.flow.getActionCard('v3_dim_wwhite');
      const dimCWhiteAction = this.homey.flow.getActionCard('v3_dim_cwhite');
      const dimRedAction = this.homey.flow.getActionCard('v3_dim_red');
      const dimGreenAction = this.homey.flow.getActionCard('v3_dim_green');
      const dimBlueAction = this.homey.flow.getActionCard('v3_dim_blue');
      const setChannelsAction = this.homey.flow.getActionCard('v3_set_channels');
      const setEffectAction = this.homey.flow.getActionCard('v3_set_effect');
		
		dimWWhiteAction.registerRunListener(async ( args, state ) => {
      await args.device.dimWWhiteTo(args.brightness);		
		});

		dimCWhiteAction.registerRunListener(async ( args, state ) => {
      await args.device.dimCWhiteTo(args.brightness);		
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
      await args.device.changeChannelsTo(args.red_channel, args.green_channel, args.blue_channel, args.wwhite_channel, args.cwhite_channel);
		});

		setEffectAction.registerRunListener(async ( args, state ) => {
         await args.device.changeEffectTo(args.effID);
         });
   
      this.log('wLightBoxDriver has been initialized');
  }

}

module.exports = wLightBoxDriver;
