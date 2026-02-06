'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class tempSensorProDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'tempSensorProDriver';
    this.driverType = 'multiSensor';
    this.driverProduct = ['tempSensorPro','tempSensorPro_v2','tempSensor_PRO_v2'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 5000;    
  }


}

module.exports = tempSensorProDriver;
