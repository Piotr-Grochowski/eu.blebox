'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class tempSensorDINDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'tempSensorDINDriver';
    this.driverType = 'multiSensor';
    this.driverProduct = ['tempSensor_DIN'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 5000;
  }

}

module.exports = tempSensorDINDriver;
