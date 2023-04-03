'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class switchBoxDINDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'switchBox';
    this.bleBoxProduct = 'switchBox_DIN';
    this.bleBoxPoll = 1000;
    this.log('switchBoxDINDriver has been initialized');
  }

}

module.exports = switchBoxDINDriver;
