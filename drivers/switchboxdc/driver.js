'use strict';

const SwitchBoxBaseDriver = require('../../lib/switchboxdriver.js');

class switchBoxDCDriver extends SwitchBoxBaseDriver {

  onSwitchBoxInit() {
    this.driverName = 'switchBoxDCDriver';
    this.driverProduct = ['switchBoxDC'];
  }

}

module.exports = switchBoxDCDriver;
