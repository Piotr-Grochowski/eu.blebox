'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class tempSensorACDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'tempSensorACDriver';
    this.driverType = 'multiSensor';
    this.driverProduct = ['tempSensorAC','tempSensorAC_v2'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 5000;    
  }
}

module.exports = tempSensorACDriver;
