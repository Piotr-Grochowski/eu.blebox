'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class windSensorDriver extends BleBoxDriver_v2 {
  
  onInitAddOn()
  {
    this.driverName = 'windSensorProDriver';
    this.driverType = 'multiSensor';
    this.driverProduct = ['windSensor_PRO'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 1000;    
  }

}

module.exports = windSensorDriver;
