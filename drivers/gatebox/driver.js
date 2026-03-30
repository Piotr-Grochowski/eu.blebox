'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class gateBoxDriver extends BleBoxDriver_v2 {

  onInitAddOn() {
    this.driverName = 'gateBoxDriver';
    this.driverType = 'gateBox';
    this.driverProduct = ['gateBox', 'RiCo'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 1000;
  }

}

module.exports = gateBoxDriver;
