'use strict';

const SwitchBoxBaseDevice = require('../../lib/switchboxdevice.js');

class switchBoxDINDevice extends SwitchBoxBaseDevice {

  getRelayCapabilities() {
    return ['onoff'];
  }

  getWebhookDriverId() {
    return 'switchBoxDIN';
  }

}

module.exports = switchBoxDINDevice;
