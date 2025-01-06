'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class wLightBoxDriver extends BleBoxDriver_v2 {

	onInitAddOn()
	{
	  this.driverName = 'wLightBoxDriver';
	  this.driverType = 'wLightBox';
	  this.driverProduct = ['wLightBox_v3'];
	  this.drivermDNSSDMethod = true;
	  this.driverIPAddressMethod = true;
	  this.driverActions = false;
	  this.driverPolling = true;
	  this.driverPollingInterval = 1000;    

     const setChannelsAction = this.homey.flow.getActionCard('v3_set_channels');

     setChannelsAction.registerRunListener(async ( args, state ) => {
      await args.device.changeChannelsTo(args.red_channel, args.green_channel, args.blue_channel, args.wwhite_channel, args.cwhite_channel);
		});
   }

}

module.exports = wLightBoxDriver;
