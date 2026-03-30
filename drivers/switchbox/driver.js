'use strict';

const SwitchBoxBaseDriver = require('../../lib/switchboxdriver.js');

class switchBoxDriver extends SwitchBoxBaseDriver {

  onSwitchBoxInit() {
    this.driverName = 'switchBoxDriver';
    this.driverProduct = ['switchBox'];
  }

}

module.exports = switchBoxDriver;
