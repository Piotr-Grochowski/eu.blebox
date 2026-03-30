'use strict';

const SwitchBoxBaseDriver = require('../../lib/switchboxdriver.js');

class switchBoxTPRODriver extends SwitchBoxBaseDriver {

  onSwitchBoxInit() {
    this.driverName = 'switchBoxTPRODriver';
    this.driverProduct = ['switchBoxT_PRO'];
  }

  getRelayFlowCards() {
    return [
      { prefix: 'onoff.relaypro1', index: 0 },
      { prefix: 'onoff.relaypro2', index: 1 },
      { prefix: 'onoff.relaypro3', index: 2 },
    ];
  }

}

module.exports = switchBoxTPRODriver;
