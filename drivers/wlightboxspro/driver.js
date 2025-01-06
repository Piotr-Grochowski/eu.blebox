'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class wLightBoxSProDriver extends BleBoxDriver_v2 {

	onInitAddOn()
	{
	  this.driverName = 'wLightBoxSProDriver';
	  this.driverType = 'wLightBox';
	  this.driverProduct = ['wLightBoxSPro'];
	  this.drivermDNSSDMethod = true;
	  this.driverIPAddressMethod = true;
	  this.driverActions = false;
	  this.driverPolling = true;
	  this.driverPollingInterval = 1000;    
   }

}

module.exports = wLightBoxSProDriver;
