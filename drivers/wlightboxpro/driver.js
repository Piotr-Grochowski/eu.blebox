'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class wLightBoxProDriver extends BleBoxDriver_v2 {

	onInitAddOn()
	{
	  this.driverName = 'wLightBoxProDriver';
	  this.driverType = 'wLightBox';
	  this.driverProduct = ['wLightBoxPro'];
	  this.drivermDNSSDMethod = true;
	  this.driverIPAddressMethod = true;
	  this.driverActions = false;
	  this.driverPolling = true;
	  this.driverPollingInterval = 1000;    

  }
} 

module.exports = wLightBoxProDriver;
