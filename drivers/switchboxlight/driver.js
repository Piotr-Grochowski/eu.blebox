'use strict';

const SwitchBoxBaseDriver = require('../../lib/switchboxdriver.js');

class switchBoxLightDriver extends SwitchBoxBaseDriver {

  onSwitchBoxInit() {
    this.driverName = 'switchBoxLightDriver';
    this.driverProduct = ['switchBoxLight'];
  }

}

module.exports = switchBoxLightDriver;
