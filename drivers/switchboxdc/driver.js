'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class switchBoxDCDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'switchBox';
    this.bleBoxProduct = 'switchBoxDC';
    this.bleBoxPoll = 1000;
    this.log('switchBoxDCDriver has been initialized');
  }

}

module.exports = switchBoxDCDriver;
