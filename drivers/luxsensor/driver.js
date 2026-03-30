'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class luxSensorDriver extends BleBoxDriver_v2 {

  onInitAddOn() {
    this.driverName = 'luxSensorDriver';
    this.driverType = 'multiSensor';
    this.driverProduct = ['luxSensor'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 5000;
  }

}

module.exports = luxSensorDriver;
