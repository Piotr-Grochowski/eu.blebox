'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class thermoBoxDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'thermoBox';
    this.bleBoxProduct = 'thermoBox';
    this.bleBoxPoll = 1000;
    this.log('thermoBoxDriver has been initialized');
  }

}

module.exports = thermoBoxDriver;
