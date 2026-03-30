'use strict';

const SwitchBoxBaseDriver = require('../../lib/switchboxdriver.js');

class switchBoxDINDriver extends SwitchBoxBaseDriver {

  onSwitchBoxInit() {
    this.driverName = 'switchBoxDINDriver';
    this.driverProduct = ['switchBox_DIN'];
  }

}

module.exports = switchBoxDINDriver;
