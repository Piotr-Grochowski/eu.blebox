'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class wLightBoxDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'wLightBox';
    this.bleBoxProduct = 'wLightBox';
    this.bleBoxPoll = 1000;
    this.log('wLightBoxDriver has been initialized');
  }

}

module.exports = wLightBoxDriver;
