'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class airSensorDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'airSensorDriver';
    this.driverType = 'airSensor';
    this.driverProduct = ['airSensor'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 60000;    
  }

}

module.exports = airSensorDriver;
