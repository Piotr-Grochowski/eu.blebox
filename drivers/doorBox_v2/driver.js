'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class doorBoxV2Driver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'gateBox';
    this.bleBoxProduct = 'doorBox_v2';
    this.bleBoxPoll = 1000;
    this.log('doorBoxV2Driver has been initialized');
  }

}

module.exports = doorBoxV2Driver;
