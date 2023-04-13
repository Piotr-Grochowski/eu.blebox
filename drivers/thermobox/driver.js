'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class thermoBoxDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'thermoBox';
    this.bleBoxProduct = 'thermoBox';
    this.bleBoxPoll = 5000;

    const setThermostatStateAction = this.homey.flow.getActionCard('set_thermostat_state_to');
    const setTargetHighTemperatureAction = this.homey.flow.getActionCard('target_hightemperature_set');

		setThermostatStateAction.registerRunListener(async ( args, state ) => {
      await args.device.setThermostatStateTo(args.state);
      });

    setTargetHighTemperatureAction.registerRunListener(async ( args, state ) => {
      await args.device.setTargetTemperature(args.target_hightemperature);
      });
  
    this.log('thermoBoxDriver has been initialized');
  }

}

module.exports = thermoBoxDriver;
