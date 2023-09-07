'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class floodSensorDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'multiSensor';
    this.bleBoxProduct = 'floodSensor';
    this.bleBoxPoll = 1000;
    this.log('floodSensorDriver has been initialized');
  }

}

module.exports = floodSensorDriver;
