'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class tempSensorProDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'multiSensor';
    this.bleBoxProduct = 'tempSensorPro';
    this.bleBoxPoll = 1000;
    this.log('tempSensorProDriver has been initialized');
  }

}

module.exports = tempSensorProDriver;
