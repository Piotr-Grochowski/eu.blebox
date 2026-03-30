'use strict';

const SwitchBoxBaseDevice = require('../../lib/switchboxdevice.js');

class switchBoxDCDevice extends SwitchBoxBaseDevice {

  getRelayCapabilities() {
    return ['onoff'];
  }

  getWebhookDriverId() {
    return 'switchBoxDC';
  }

}

module.exports = switchBoxDCDevice;
