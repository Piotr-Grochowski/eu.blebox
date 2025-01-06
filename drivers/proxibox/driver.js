'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');

class proxiBoxDriver extends BleBoxDriver_v2 {

  onInitAddOn()
  {
    this.driverName = 'proxiBox';
    this.driverType = 'buttonBox';
    this.driverProduct = ['proxiBox'];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = true;
    this.driverPolling = false;
    this.driverPollingInterval = 600000;    
  }


}

module.exports = proxiBoxDriver;
