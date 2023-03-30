'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class gateBoxProDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'gateBox';
    this.bleBoxProduct = 'gateBoxPro';
    this.bleBoxPoll = 1000;
    this.log('gateBoxProDriver has been initialized');
  }

}

module.exports = gateBoxProDriver;
