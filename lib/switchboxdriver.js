'use strict';

const BleBoxDriver_v2 = require('./bleboxdriver_v2.js');

class SwitchBoxBaseDriver extends BleBoxDriver_v2 {

  /**
   * Override to return relay flow card definitions.
   * E.g. [{ prefix: 'onoff.relay1', index: 0 }, { prefix: 'onoff.relay2', index: 1 }]
   */
  getRelayFlowCards() {
    return [];
  }

  onInitAddOn() {
    this.driverType = 'switchBox';
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = true;
    this.driverPolling = true;
    this.driverPollingInterval = 1000;

    this.onSwitchBoxInit();
    this.registerRelayFlowCards();
  }

  /**
   * Override in subclass to set driverProduct, driverName, etc.
   */
  onSwitchBoxInit() {
  }

  registerRelayFlowCards() {
    for (const relay of this.getRelayFlowCards()) {
      const { prefix, index } = relay;

      this.homey.flow.getActionCard(`${prefix}_on`)
        .registerRunListener(async (args) => {
          await args.device.setRelay(index, true);
        });

      this.homey.flow.getActionCard(`${prefix}_off`)
        .registerRunListener(async (args) => {
          await args.device.setRelay(index, false);
        });

      this.homey.flow.getActionCard(`${prefix}_toggle`)
        .registerRunListener(async (args) => {
          await args.device.toggleRelay(index);
        });

      this.homey.flow.getConditionCard(`${prefix}_turnedonoff`)
        .registerRunListener(async (args) => {
          return args.device.isRelayOn(index);
        });
    }
  }
}

module.exports = SwitchBoxBaseDriver;
