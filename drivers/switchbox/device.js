'use strict';

const SwitchBoxBaseDevice = require('../../lib/switchboxdevice.js');

class switchBoxDevice extends SwitchBoxBaseDevice {

  getRelayCapabilities() {
    return ['onoff'];
  }

}

module.exports = switchBoxDevice;
