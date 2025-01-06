'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class floodSensorDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'floodSensorDriver';
    this.driverType = 'multiSensor';
    this.driverProduct = ['floodSensor'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = true;
    this.driverPolling = true;
    this.driverPollingInterval = 60000;    
  }

}

module.exports = floodSensorDriver;
