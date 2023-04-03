'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class switchBoxTPRODriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.  
  async onInit()
  {
    this.bleBoxType = 'switchBox';
    this.bleBoxProduct = 'switchBoxT_PRO';
    this.bleBoxPoll = 1000;

    const turnRelay1On = this.homey.flow.getActionCard('onoff.relaypro1_on');
    const turnRelay1Off = this.homey.flow.getActionCard('onoff.relaypro1_off');
    const turnRelay2On = this.homey.flow.getActionCard('onoff.relaypro2_on');
    const turnRelay2Off = this.homey.flow.getActionCard('onoff.relaypro2_off');
    const turnRelay3On = this.homey.flow.getActionCard('onoff.relaypro3_on');
    const turnRelay3Off = this.homey.flow.getActionCard('onoff.relaypro3_off');
    const toggleRelay1 = this.homey.flow.getActionCard('onoff.relaypro1_toggle');
    const toggleRelay2 = this.homey.flow.getActionCard('onoff.relaypro2_toggle');
    const toggleRelay3 = this.homey.flow.getActionCard('onoff.relaypro3_toggle');
    const isRelay1On = this.homey.flow.getConditionCard('onoff.relaypro1_turnedonoff');
    const isRelay2On = this.homey.flow.getConditionCard('onoff.relaypro2_turnedonoff');
    const isRelay3On = this.homey.flow.getConditionCard('onoff.relaypro3_turnedonoff');

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

    turnRelay3On.registerRunListener(async ( args, state ) => {
      await args.device.setRelay(2,true);
		});

    turnRelay3Off.registerRunListener(async ( args, state ) => {
      await args.device.setRelay(2,false);
		});

    toggleRelay1.registerRunListener(async ( args, state ) => {
      await args.device.toggleRelay(0);
		});

    toggleRelay2.registerRunListener(async ( args, state ) => {
      await args.device.toggleRelay(1);
		});

    toggleRelay3.registerRunListener(async ( args, state ) => {
      await args.device.toggleRelay(2);
		});

    isRelay1On.registerRunListener(async ( args, state ) => {
      return args.device.isRelayOn(0);
		});

    isRelay2On.registerRunListener(async ( args, state ) => {
      return args.device.isRelayOn(1);
		});

    isRelay3On.registerRunListener(async ( args, state ) => {
      return args.device.isRelayOn(2);
		});

    this.log('switchBoxTPRODriver has been initialized');
  }

}

module.exports = switchBoxTPRODriver;
