'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class actionBoxDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'actionBox';
    this.driverType = 'buttonBox';
    this.driverProduct = ['actionBox'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = true;
    this.driverPolling = false;
    this.driverPollingInterval = 600000;    
  }

}

module.exports = actionBoxDriver;
