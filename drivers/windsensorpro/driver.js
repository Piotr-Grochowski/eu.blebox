'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class windSensorDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'multiSensor';
    this.bleBoxProduct = 'windSensor_PRO';
    this.bleBoxPoll = 1000;
    this.log('windSensorProDriver has been initialized');
  }

}

module.exports = windSensorDriver;
