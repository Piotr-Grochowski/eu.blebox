'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class thermoBoxClassicDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'thermoBoxDriver';
    this.driverType = 'thermoBox';
    this.driverProduct = ['thermoBox'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 1000;    

  }
}

module.exports = thermoBoxClassicDriver;