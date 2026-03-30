'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

class dacBoxDDevice extends BleBoxDevice {

  async onBleBoxInit() {
    this.previousDimLevel1 = 1;
    this.previousDimLevel2 = 1;

    this.registerCapabilityListener('onoff.channel1', async (value) => {
      await this.setChannelOnOff(0, value);
    });
    this.registerCapabilityListener('onoff.channel2', async (value) => {
      await this.setChannelOnOff(1, value);
    });
    this.registerCapabilityListener('dim.channel1', async (value) => {
      await this.setChannelDim(0, value);
    });
    this.registerCapabilityListener('dim.channel2', async (value) => {
      await this.setChannelDim(1, value);
    });
  }

  async pollBleBox() {
    await this.bbApi.wLightBoxGetState(this.getSetting('address'), this.getSetting('apiLevel'))
      .then((result) => {
        const hex = result.rgbw.desiredColor;
        // 2 channels, 2 hex chars each: AABB
        const level1 = Math.round((parseInt(hex.substring(0, 2), 16) / 255) * 100) / 100;
        const level2 = Math.round((parseInt(hex.substring(2, 4), 16) / 255) * 100) / 100;

        if (level1 > 0) this.previousDimLevel1 = level1;
        if (level2 > 0) this.previousDimLevel2 = level2;

        if (level1 !== this.getCapabilityValue('dim.channel1')) {
          this.setCapabilityValue('dim.channel1', level1).catch((err) => this.log(err));
        }
        if (level2 !== this.getCapabilityValue('dim.channel2')) {
          this.setCapabilityValue('dim.channel2', level2).catch((err) => this.log(err));
        }

        const on1 = level1 > 0;
        const on2 = level2 > 0;
        if (on1 !== this.getCapabilityValue('onoff.channel1')) {
          this.setCapabilityValue('onoff.channel1', on1).catch((err) => this.log(err));
        }
        if (on2 !== this.getCapabilityValue('onoff.channel2')) {
          this.setCapabilityValue('onoff.channel2', on2).catch((err) => this.log(err));
        }
      })
      .catch((error) => this.log(error));
  }

  async setChannelOnOff(channel, value) {
    if (value) {
      const prevLevel = channel === 0 ? this.previousDimLevel1 : this.previousDimLevel2;
      const hexVal = this.toHex(Math.round(prevLevel * 255));
      await this.sendChannelState(channel, hexVal);
    } else {
      await this.sendChannelState(channel, '00');
    }
  }

  async setChannelDim(channel, value) {
    const hexVal = this.toHex(Math.round(value * 255));
    await this.sendChannelState(channel, hexVal);
  }

  async sendChannelState(channel, hexValue) {
    // Read current state to preserve the other channel
    try {
      const result = await this.bbApi.wLightBoxGetState(this.getSetting('address'), this.getSetting('apiLevel'));
      const hex = result.rgbw.desiredColor;
      const ch1 = channel === 0 ? hexValue : hex.substring(0, 2);
      const ch2 = channel === 1 ? hexValue : hex.substring(2, 4);
      await this.bbApi.wLightBoxSetState(this.getSetting('address'), ch1 + ch2);
    } catch (error) {
      this.log(error);
    }
  }

  toHex(value) {
    const hex = value.toString(16);
    return hex.length < 2 ? `0${hex}` : hex;
  }
}

module.exports = dacBoxDDevice;
