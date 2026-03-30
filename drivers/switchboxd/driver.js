'use strict';

const SwitchBoxBaseDriver = require('../../lib/switchboxdriver.js');

class switchBoxDDriver extends SwitchBoxBaseDriver {

  onSwitchBoxInit() {
    this.driverName = 'switchBoxDDriver';
    this.driverProduct = ['switchBoxD'];
  }

  getRelayFlowCards() {
    return [
      { prefix: 'onoff.relay1', index: 0 },
      { prefix: 'onoff.relay2', index: 1 },
    ];
  }

}

module.exports = switchBoxDDriver;
