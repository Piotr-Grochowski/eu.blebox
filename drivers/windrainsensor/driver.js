'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class windRainSensorDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'windRainSensorProDriver';
    this.driverType = 'multiSensor';
    this.driverProduct = ['windRainSensor'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 1000;    
  }

}

module.exports = windRainSensorDriver;
