'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class switchBoxDDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'switchBoxD';
    this.bleBoxProduct = 'switchBoxD';
    this.bleBoxPoll = 1000;
    this.log('switchBoxDDriver has been initialized');
  }

}

module.exports = switchBoxDDriver;
