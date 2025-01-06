const Homey = require('homey');

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');


module.exports = class shutterBoxDCDriver extends BleBoxDriver_v2 {
	
	onInitAddOn()
	{
	  this.driverName = 'shutterBoxDCDriver';
	  this.driverType = 'shutterBox';
	  this.driverProduct = [];
	  this.drivermDNSSDMethod = true;
	  this.driverIPAddressMethod = true;
	  this.driverActions = false;
	  this.driverPolling = true;
	  this.driverPollingInterval = 1000;    
  
	}
  
}