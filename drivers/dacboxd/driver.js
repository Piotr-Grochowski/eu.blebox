'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class dacBoxDDriver extends BleBoxDriver_v2 {

  onInitAddOn() {
    this.driverName = 'dacBoxDDriver';
    this.driverType = 'wLightBox';
    this.driverProduct = ['dacBoxD', 'dacBoxD_DC'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 1000;
  }

}

module.exports = dacBoxDDriver;
