'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class tempSensorACDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'multiSensor';
    this.bleBoxProduct = 'tempSensorAC';
    this.bleBoxPoll = 1000;
    this.log('tempSensorACDriver has been initialized');
  }

}

module.exports = tempSensorACDriver;
