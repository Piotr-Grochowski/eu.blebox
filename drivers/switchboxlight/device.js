'use strict';

const SwitchBoxBaseDevice = require('../../lib/switchboxdevice.js');

class switchBoxLightDevice extends SwitchBoxBaseDevice {

  getRelayCapabilities() {
    return ['onoff'];
  }

  getWebhookDriverId() {
    return 'switchBoxLight';
  }

}

module.exports = switchBoxLightDevice;
