'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class switchBoxDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'switchBox';
    this.bleBoxProduct = 'switchBox';
    this.bleBoxPoll = 1000;
    this.log('switchBoxDriver has been initialized');
  }

}

module.exports = switchBoxDriver;
