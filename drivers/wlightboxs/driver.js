'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class wLightBoxSDriver extends BleBoxDriver_v2 {

	onInitAddOn()
	{
	  this.driverName = 'wLightBoxSDriver';
	  this.driverType = 'wLightBox';
	  this.driverProduct = ['wLightBoxS'];
	  this.drivermDNSSDMethod = true;
	  this.driverIPAddressMethod = true;
	  this.driverActions = false;
	  this.driverPolling = true;
	  this.driverPollingInterval = 1000;    
   }

}

module.exports = wLightBoxSDriver;
