'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class windRainSensorDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'multiSensor';
    this.bleBoxProduct = 'windRainSensor';
    this.bleBoxPoll = 1000;
    this.log('windRainSensorDriver has been initialized');
  }

}

module.exports = windRainSensorDriver;
