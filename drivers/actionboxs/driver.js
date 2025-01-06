'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class actionBoxSDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'actionBoxS';
    this.driverType = 'buttonBox';
    this.driverProduct = ['actionBoxS'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = true;
    this.driverPolling = false;
    this.driverPollingInterval = 600000;    
  }


}

module.exports = actionBoxSDriver;
