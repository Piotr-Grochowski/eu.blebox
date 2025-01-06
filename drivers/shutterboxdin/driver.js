'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class shutterBoxDINDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'shutterBoxDINDriver';
    this.driverType = 'shutterBox';
    this.driverProduct = ['shutterBox_DIN'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 1000;    

  }
}

module.exports = shutterBoxDINDriver;
