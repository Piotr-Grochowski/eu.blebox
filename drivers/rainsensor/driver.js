'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class rainSensorDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'rainSensorDriver';
    this.driverType = 'multiSensor';
    this.driverProduct = ['rainSensor'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = true;
    this.driverPolling = true;
    this.driverPollingInterval = 5000;    
  }

}

module.exports = rainSensorDriver;
