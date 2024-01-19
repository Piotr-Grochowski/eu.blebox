'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class wLightBoxSDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'wLightBox';
    this.bleBoxProduct = 'wLightBoxS';
    this.bleBoxPoll = 1000;

    const setEffectAction = this.homey.flow.getActionCard('wlightboxs_set_effect');

		setEffectAction.registerRunListener(async ( args, state ) => {
      await args.device.changeEffectTo(args.effID);
      });


    this.log('wLightBoxSDriver has been initialized');
  }

}

module.exports = wLightBoxSDriver;
