'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class switchBoxLightDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'switchBox';
    this.bleBoxProduct = 'switchBoxLight';
    this.bleBoxPoll = 1000;
    this.log('switchBoxLightDriver has been initialized');
  }

}

module.exports = switchBoxLightDriver;
