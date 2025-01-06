'use strict';

const Homey = require('homey');

const util = require('./lib/util.js');

const BleBoxAPI = require('./lib/bleboxapi.js')

class BleBoxApp extends Homey.App {

	async onInit() {

		const dimWhiteAction = this.homey.flow.getActionCard('dim_white');
		const dimCWhiteAction = this.homey.flow.getActionCard('dim_cwhite');
		const dimWWhiteAction = this.homey.flow.getActionCard('dim_wwhite');
		const dimRedAction = this.homey.flow.getActionCard('dim_red');
		const dimGreenAction = this.homey.flow.getActionCard('dim_green');
		const dimBlueAction = this.homey.flow.getActionCard('dim_blue');
		const setChannelsAction = this.homey.flow.getActionCard('set_channels');
		const setEffectAction = this.homey.flow.getActionCard('wlightbox_set_effect');
		const moveToFavoritePosition = this.homey.flow.getActionCard('move_to_favorite_pos');

		moveToFavoritePosition.registerRunListener(async ( args, state ) => {
		await args.device.moveToFavPos();
		});

		dimWhiteAction.registerRunListener(async ( args, state ) => {
		await args.device.dimWhiteTo(args.brightness);		
		});
   
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
		   await args.device.changeChannelsTo(args.red_channel, args.green_channel, args.blue_channel, args.white_channel);
		});
   
		setEffectAction.registerRunListener(async ( args, state ) => {
		   await args.device.changeEffectTo(args.effID);
		   });

		this.log('BleBox App is running...');
	}

}

module.exports = BleBoxApp;
