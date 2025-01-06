'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class dimmerBoxDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'dimmerBoxDriver';
    this.driverType = 'dimmerBox';
    this.driverProduct = ['dimmerBox', 'dimmerBox_v2'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = false;
    this.driverPolling = true;
    this.driverPollingInterval = 1000;    
  }

}

module.exports = dimmerBoxDriver;
