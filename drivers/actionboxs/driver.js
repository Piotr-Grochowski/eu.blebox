'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class actionBoxSDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'buttonBox';
    this.bleBoxProduct = 'actionBoxS';
    this.bleBoxPoll = 600000;
    this.log('actionBoxSDriver has been initialized');
  }

}

module.exports = actionBoxSDriver;
