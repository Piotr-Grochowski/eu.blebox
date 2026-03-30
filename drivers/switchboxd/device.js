'use strict';

const SwitchBoxBaseDevice = require('../../lib/switchboxdevice.js');

class switchBoxDDevice extends SwitchBoxBaseDevice {

  getRelayCapabilities() {
    return ['onoff.relay1', 'onoff.relay2'];
  }

  getWebhookDriverId() {
    return 'switchBoxD';
  }

}

module.exports = switchBoxDDevice;
