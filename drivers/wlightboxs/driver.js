'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class wLightBoxSDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'wLightBox';
    this.bleBoxProduct = 'wLightBoxS';
    this.bleBoxPoll = 1000;
    this.log('wLightBoxSDriver has been initialized');
  }

}

module.exports = wLightBoxSDriver;
