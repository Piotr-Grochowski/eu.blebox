'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

module.exports = class rollerGateDriver extends BleBoxDriver_v2 {
	
	onInitAddOn()
	{
	  this.driverName = 'rollerGateDriver';
	  this.driverType = 'gateController';
	  this.driverProduct = [];
	  this.drivermDNSSDMethod = true;
	  this.driverIPAddressMethod = true;
	  this.driverActions = false;
	  this.driverPolling = true;
	  this.driverPollingInterval = 1000;    
	}
}