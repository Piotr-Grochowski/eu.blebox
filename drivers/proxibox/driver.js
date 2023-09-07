'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class proxiBoxDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'buttonBox';
    this.bleBoxProduct = 'proxiBox';
    this.bleBoxPoll = 60000;
    this.log('proxiBoxDriver has been initialized');
  }

}

module.exports = proxiBoxDriver;
