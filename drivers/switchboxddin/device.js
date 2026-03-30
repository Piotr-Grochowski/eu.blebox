'use strict';

const SwitchBoxBaseDevice = require('../../lib/switchboxdevice.js');

class switchBoxDDINDevice extends SwitchBoxBaseDevice {

  getRelayCapabilities() {
    return ['onoff.relaydin1', 'onoff.relaydin2'];
  }

  getWebhookDriverId() {
    return 'switchBoxDDIN';
  }

}

module.exports = switchBoxDDINDevice;
