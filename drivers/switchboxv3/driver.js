'use strict';

const SwitchBoxBaseDriver = require('../../lib/switchboxdriver.js');

class switchBoxV3Driver extends SwitchBoxBaseDriver {

  onSwitchBoxInit() {
    this.driverName = 'switchBoxV3Driver';
    this.driverProduct = ['switchBox_v3'];
  }

}

module.exports = switchBoxV3Driver;
