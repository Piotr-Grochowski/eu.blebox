'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class tempSensorDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'tempSensor';
    this.bleBoxProduct = 'tempSensor';
    this.bleBoxPoll = 1000;
    this.log('tempSensorDriver has been initialized');
  }

}

module.exports = tempSensorDriver;
