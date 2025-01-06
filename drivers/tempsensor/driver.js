'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class tempSensorDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'tempSensor';
    this.driverType = 'tempSensor';
    this.driverProduct = ['tempSensor','tempSensor_v2'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 5000;    
  }
}

module.exports = tempSensorDriver;
