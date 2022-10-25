'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class airSensorDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'airSensor';
    this.bleBoxProduct = '';
    this.bleBoxPoll = 60000;
    this.log('airSensorDriver has been initialized');
  }

}

module.exports = airSensorDriver;
