'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class doorBoxV2Driver extends BleBoxDriver_v2 {

  onInitAddOn() {
    this.driverName = 'doorBoxV2Driver';
    this.driverType = 'gateBox';
    this.driverProduct = ['doorBox_v2'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 1000;
  }

}

module.exports = doorBoxV2Driver;
