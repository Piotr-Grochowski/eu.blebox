'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class actionBoxDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'buttonBox';
    this.bleBoxProduct = 'actionBox';
    this.bleBoxPoll = 600000;
    this.log('actionBoxDriver has been initialized');
  }

}

module.exports = actionBoxDriver;
