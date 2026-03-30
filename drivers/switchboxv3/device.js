'use strict';

const SwitchBoxBaseDevice = require('../../lib/switchboxdevice.js');

class switchBoxV3Device extends SwitchBoxBaseDevice {

  getRelayCapabilities() {
    return ['onoff'];
  }

  getWebhookDriverId() {
    return 'switchBoxV3';
  }

}

module.exports = switchBoxV3Device;
