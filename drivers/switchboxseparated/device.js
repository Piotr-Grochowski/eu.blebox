'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class switchBoxSeparatedDevice extends BleBoxDevice {

  async onInit() {
    if (!this.getSetting('polling_enabled')) {
      await this.setSettings({ polling_enabled: 'Yes' });
    }
    await super.onInit();
  }

  async onBleBoxInit() {
    const relayIndex = this.getStoreValue('relayIndex') || 0;

    this.registerCapabilityListener('onoff', async (value) => {
      await this.bbApi.switchBoxSetRelayState(this.getSetting('address'), relayIndex, value);
    });

    // Dynamically add power meter capabilities if device supports them
    try {
      const state = await this.bbApi.switchBoxGetState(this.getSetting('address'), this.getSetting('apiLevel'));
      if (state && state.powerMeasuring && state.powerMeasuring.enabled === 1) {
        const consumption = state.powerMeasuring.powerConsumption || [];
        if (consumption.length > 0) {
          if (!this.hasCapability('meter_power')) {
            await this.addCapability('meter_power');
          }
        }
        const activePowerSensors = (state.sensors || []).filter((s) => s.type === 'activePower');
        if (activePowerSensors.length > 0) {
          if (!this.hasCapability('measure_power')) {
            await this.addCapability('measure_power');
          }
        }
      }
    } catch (err) {
      this.log('Could not detect power metering capabilities: ' + err);
    }

    // Register webhooks if enabled
    if (this.getSetting('webhooks_enabled') === 'Yes') {
      await this.registerWebhooks();
    }
  }

  async registerWebhooks() {
    const myIp = await this.homey.cloud.getLocalAddress();
    const deviceId = this.getData().id;
    const address = this.getSetting('address');
    const relayIndex = this.getStoreValue('relayIndex') || 0;

    const triggerTypes = [
      { type: 1, name: 'click' },
      { type: 2, name: 'clickLong' },
      { type: 3, name: 'fallingEdge' },
      { type: 4, name: 'risingEdge' },
      { type: 5, name: 'anyEdge' },
    ];

    let actionNo = 10 + (relayIndex * 5);
    for (const trigger of triggerTypes) {
      const url = `http://${myIp}/api/app/eu.blebox/switchBoxSeparated?device=${deviceId}&input=1&action=${trigger.name}`;
      await this.bbApi.actionBoxRegisterWebhook(address, actionNo, relayIndex, trigger.type, url);
      await delay(300);
      actionNo++;
    }
  }

  async pollBleBox() {
    const relayIndex = this.getStoreValue('relayIndex') || 0;

    await this.bbApi.switchBoxGetState(this.getSetting('address'), this.getSetting('apiLevel'))
      .then(async (result) => {
        const state = result.relays[relayIndex].state === 1;
        if (state !== this.getCapabilityValue('onoff')) {
          await this.setCapabilityValue('onoff', state).catch((e) => this.log(e));
        }

        if (this.hasCapability('meter_power') && result.powerMeasuring && result.powerMeasuring.enabled === 1) {
          const consumption = result.powerMeasuring.powerConsumption || [];
          // Use per-relay entry if available, otherwise aggregate (first entry)
          const entry = consumption[relayIndex] || consumption[0];
          if (entry) {
            await this.setCapabilityValue('meter_power', entry.value).catch((e) => this.log(e));
          }
        }
        if (this.hasCapability('measure_power')) {
          const activePowerSensors = (result.sensors || []).filter((s) => s.type === 'activePower');
          const sensor = activePowerSensors[relayIndex] || activePowerSensors[0];
          if (sensor) {
            await this.setCapabilityValue('measure_power', sensor.value).catch((e) => this.log(e));
          }
        }
      })
      .catch((error) => {
        this.log(error);
      });
  }

  // Webhook event handlers - always input 1 from this device's perspective
  async onButtonClicked() {
    const card = this.homey.flow.getDeviceTriggerCard('input1_clicked');
    await card.trigger(this, {}, {});
  }

  async onButtonClickedLong() {
    const card = this.homey.flow.getDeviceTriggerCard('input1_clicked_long');
    await card.trigger(this, {}, {});
  }

  async onButtonFallingEdge() {
    const card = this.homey.flow.getDeviceTriggerCard('input1_falling_edge');
    await card.trigger(this, {}, {});
  }

  async onButtonRisingEdge() {
    const card = this.homey.flow.getDeviceTriggerCard('input1_rising_edge');
    await card.trigger(this, {}, {});
  }

  async onButtonAnyEdge() {
    const card = this.homey.flow.getDeviceTriggerCard('input1_any_edge');
    await card.trigger(this, {}, {});
  }
}

module.exports = switchBoxSeparatedDevice;
