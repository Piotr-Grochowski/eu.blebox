'use strict';

const SwitchBoxBaseDriver = require('../../lib/switchboxdriver.js');

class switchBoxDDINDriver extends SwitchBoxBaseDriver {

  onSwitchBoxInit() {
    this.driverName = 'switchBoxDDINDriver';
    this.driverProduct = ['switchBoxD_DIN'];
  }

  getRelayFlowCards() {
    return [
      { prefix: 'onoff.relaydin1', index: 0 },
      { prefix: 'onoff.relaydin2', index: 1 },
    ];
  }

}

module.exports = switchBoxDDINDriver;
