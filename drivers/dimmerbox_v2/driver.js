'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class dimmerBoxV2Driver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'dimmerBox';
    this.bleBoxProduct = 'dimmerBox_v2';
    this.bleBoxPoll = 1000;
    this.log('dimmerBoxV2Driver has been initialized');
  }

}

module.exports = dimmerBoxV2Driver;
