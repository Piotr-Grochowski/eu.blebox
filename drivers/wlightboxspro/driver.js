'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class wLightBoxSProDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'wLightBox';
    this.bleBoxProduct = 'wLightBoxSPro';
    this.bleBoxPoll = 1000;
    this.log('wLightBoxSProDriver has been initialized');
  }

}

module.exports = wLightBoxSProDriver;
