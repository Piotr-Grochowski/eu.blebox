'use strict';

const SwitchBoxBaseDevice = require('../../lib/switchboxdevice.js');

class switchBoxTPRODevice extends SwitchBoxBaseDevice {

  getRelayCapabilities() {
    return ['onoff.relaypro1', 'onoff.relaypro2', 'onoff.relaypro3'];
  }

  getWebhookDriverId() {
    return 'switchBoxTPRO';
  }

}

module.exports = switchBoxTPRODevice;
