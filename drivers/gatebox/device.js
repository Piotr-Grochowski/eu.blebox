'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

class gateBoxDevice extends BleBoxDevice {

  async onInit() {
    // Migration from v1: ensure polling_enabled exists for devices paired under old architecture
    if (!this.getSetting('polling_enabled')) {
      await this.setSettings({ polling_enabled: 'Yes' });
    }
    await super.onInit();
  }

  async onBleBoxInit() {
    this.registerCapabilityListener('button', this.onCapabilityButton.bind(this));
  }

  async pollBleBox() {
    await this.bbApi.gateBoxGetState(
      this.getSetting('address'),
      this.getSetting('apiLevel'),
      this.getSetting('username'),
      this.getSetting('password'),
    )
      .then(async (result) => {
        const state = result.gate.currentPos !== 0;

        if (state !== this.getCapabilityValue('alarm_contact')) {
          await this.setCapabilityValue('alarm_contact', state)
            .catch((err) => this.log(err));
        }
      })
      .catch((error) => this.log(error));
  }

  async onCapabilityButton() {
    await this.bbApi.gateBoxPrimaryButton(
      this.getSetting('address'),
      this.getSetting('username'),
      this.getSetting('password'),
    )
      .catch((error) => {
        this.log(error);
        this.error(error);
      });
  }
}

module.exports = gateBoxDevice;
