'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class switchBoxV3Driver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'switchBox';
    this.bleBoxProduct = 'switchBox_v3';
    this.bleBoxPoll = 1000;
    this.log('switchBoxV3Driver has been initialized');
  }

}

module.exports = switchBoxV3Driver;
