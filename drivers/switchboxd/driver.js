'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class switchBoxDDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'switchBoxD';
    this.bleBoxProduct = 'switchBoxD';
    this.bleBoxPoll = 1000;

    const turnRelay1On = this.homey.flow.getActionCard('onoff.relay1_on');
    const turnRelay1Off = this.homey.flow.getActionCard('onoff.relay1_off');
    const turnRelay2On = this.homey.flow.getActionCard('onoff.relay2_on');
    const turnRelay2Off = this.homey.flow.getActionCard('onoff.relay2_off');
    const toggleRelay1 = this.homey.flow.getActionCard('onoff.relay1_toggle');
    const toggleRelay2 = this.homey.flow.getActionCard('onoff.relay2_toggle');
    const isRelay1On = this.homey.flow.getConditionCard('onoff.relay1_turnedonoff');
    const isRelay2On = this.homey.flow.getConditionCard('onoff.relay2_turnedonoff');

		turnRelay1On.registerRunListener(async ( args, state ) => {
      await args.device.setRelay(0,true);
		});

		turnRelay1Off.registerRunListener(async ( args, state ) => {
      await args.device.setRelay(0,false);
		});

    turnRelay2On.registerRunListener(async ( args, state ) => {
      await args.device.setRelay(1,true);
		});

    turnRelay2Off.registerRunListener(async ( args, state ) => {
      await args.device.setRelay(1,false);
		});

    toggleRelay1.registerRunListener(async ( args, state ) => {
      await args.device.toggleRelay(0);
		});

    toggleRelay2.registerRunListener(async ( args, state ) => {
      await args.device.toggleRelay(1);
		});

    isRelay1On.registerRunListener(async ( args, state ) => {
      return args.device.isRelayOn(0);
		});

    isRelay2On.registerRunListener(async ( args, state ) => {
      return args.device.isRelayOn(1);
		});

    this.log('switchBoxDDriver has been initialized');
  }

}

module.exports = switchBoxDDriver;
