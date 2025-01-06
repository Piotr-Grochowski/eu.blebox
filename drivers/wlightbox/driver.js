'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class wLightBoxDriver extends BleBoxDriver_v2 {

	onInitAddOn()
	{
	  this.driverName = 'wLightBoxDriver';
	  this.driverType = 'wLightBox';
	  this.driverProduct = ['wLightBox'];
	  this.drivermDNSSDMethod = true;
	  this.driverIPAddressMethod = true;
	  this.driverActions = false;
	  this.driverPolling = true;
	  this.driverPollingInterval = 1000;    
   }
}

module.exports = wLightBoxDriver;
