'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class rainSensorDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'multiSensor';
    this.bleBoxProduct = 'rainSensor';
    this.bleBoxPoll = 1000;
    this.log('rainSensorDriver has been initialized');
  }

}

module.exports = rainSensorDriver;
