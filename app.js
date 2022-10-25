'use strict';

const Homey = require('homey');

const util = require('/lib/util.js');

const BleBoxAPI = require('/lib/bleboxapi.js')

class BleBoxApp extends Homey.App {

	async onInit() {
		this.log('BleBox App is running...');
	
    this.bbApi = new BleBoxAPI();

		let dimWhiteAction = this.homey.flow.getActionCard('dim_white');
		let dimRedAction = this.homey.flow.getActionCard('dim_red');
		let dimGreenAction = this.homey.flow.getActionCard('dim_green');
		let dimBlueAction = this.homey.flow.getActionCard('dim_blue');
		let setChannelsAction = this.homey.flow.getActionCard('set_channels');
		let moveToFavoritePosition = this.homey.flow.getActionCard('move_to_favorite_pos');

		moveToFavoritePosition.registerRunListener(async ( args, state ) => {
      await this.bbApi.shutterBoxSetFavPos(args.my_device.getSetting('address'));
		});


		dimWhiteAction.registerRunListener(async ( args, state ) => {
			var hexChannelR = Math.round(args.my_device.getCapabilityValue('dim.channelR')*255).toString(16);
			var hexChannelG = Math.round(args.my_device.getCapabilityValue('dim.channelG')*255).toString(16);
			var hexChannelB = Math.round(args.my_device.getCapabilityValue('dim.channelB')*255).toString(16);
			var hexChannelW = Math.round(args.brightness*255).toString(16);

			if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
			if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
			if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
			if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

			// Change the color
      await this.bbApi.wLightBoxSetState(args.my_device.getSetting('address'), hexChannelR+hexChannelG+hexChannelB+hexChannelW);
		
		});

		dimRedAction.registerRunListener(async ( args, state ) => {
			var hexChannelW = Math.round(args.my_device.getCapabilityValue('dim.channelW')*255).toString(16);
			var hexChannelG = Math.round(args.my_device.getCapabilityValue('dim.channelG')*255).toString(16);
			var hexChannelB = Math.round(args.my_device.getCapabilityValue('dim.channelB')*255).toString(16);
			var hexChannelR = Math.round(args.brightness*255).toString(16);

			if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
			if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
			if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
			if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

			// Change the color
      await this.bbApi.wLightBoxSetState(args.my_device.getSetting('address'), hexChannelR+hexChannelG+hexChannelB+hexChannelW);
		
		});

		dimGreenAction.registerRunListener(async ( args, state ) => {
			var hexChannelR = Math.round(args.my_device.getCapabilityValue('dim.channelR')*255).toString(16);
			var hexChannelW = Math.round(args.my_device.getCapabilityValue('dim.channelW')*255).toString(16);
			var hexChannelB = Math.round(args.my_device.getCapabilityValue('dim.channelB')*255).toString(16);
			var hexChannelG = Math.round(args.brightness*255).toString(16);

			if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
			if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
			if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
			if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

			// Change the color
      await this.bbApi.wLightBoxSetState(args.my_device.getSetting('address'), hexChannelR+hexChannelG+hexChannelB+hexChannelW);
		
		});

    dimBlueAction.registerRunListener(async ( args, state ) => {
			var hexChannelR = Math.round(args.my_device.getCapabilityValue('dim.channelR')*255).toString(16);
			var hexChannelG = Math.round(args.my_device.getCapabilityValue('dim.channelG')*255).toString(16);
			var hexChannelW = Math.round(args.my_device.getCapabilityValue('dim.channelW')*255).toString(16);
			var hexChannelB = Math.round(args.brightness*255).toString(16);

			if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
			if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
			if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
			if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

			// Change the color
      await this.bbApi.wLightBoxSetState(args.my_device.getSetting('address'), hexChannelR+hexChannelG+hexChannelB+hexChannelW);
		
		});

		setChannelsAction.registerRunListener(async ( args, state ) => {
			var hexChannelR = Math.round(args.red_channel*255).toString(16);
			var hexChannelG = Math.round(args.green_channel*255).toString(16);
			var hexChannelB = Math.round(args.blue_channel*255).toString(16);
			var hexChannelW = Math.round(args.white_channel*255).toString(16);

			if(hexChannelR.length==1) hexChannelR = '0'+hexChannelR;
			if(hexChannelG.length==1) hexChannelG = '0'+hexChannelG;
			if(hexChannelB.length==1) hexChannelB = '0'+hexChannelB;
			if(hexChannelW.length==1) hexChannelW = '0'+hexChannelW;

			// Change the color
      await this.bbApi.wLightBoxSetState(args.my_device.getSetting('address'), hexChannelR+hexChannelG+hexChannelB+hexChannelW);
		
		});

	}

}

module.exports = BleBoxApp;
