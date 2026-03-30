'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class gateBoxProDriver extends BleBoxDriver_v2 {

  onInitAddOn() {
    this.driverName = 'gateBoxProDriver';
    this.driverType = 'gateBox';
    this.driverProduct = ['gateBoxPro'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 1000;
  }

}

module.exports = gateBoxProDriver;
