'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class humiditySensorDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'multiSensor';
    this.bleBoxProduct = 'humiditySensor';
    this.bleBoxPoll = 1000;
    this.log('humiditySensorDriver has been initialized');
  }

}

module.exports = humiditySensorDriver;
