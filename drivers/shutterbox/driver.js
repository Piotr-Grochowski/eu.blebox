'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class shutterBoxDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'shutterBoxDriver';
    this.driverType = 'shutterBox';
    this.driverProduct = ['shutterBox'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 1000;    

  }
}

module.exports = shutterBoxDriver;
