'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class doorBoxProDriver extends BleBoxDriver_v2 {

  onInitAddOn() {
    this.driverName = 'doorBoxProDriver';
    this.driverType = 'gateBox';
    this.driverProduct = ['doorBox_PRO'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 1000;
  }

}

module.exports = doorBoxProDriver;
