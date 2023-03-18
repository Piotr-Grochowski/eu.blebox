'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class wLightBoxProDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'wLightBox';
    this.bleBoxProduct = 'wLightBoxPro';
    this.bleBoxPoll = 1000;
    this.log('wLightBoxProDriver has been initialized');
  }

}

module.exports = wLightBoxProDriver;
