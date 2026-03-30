'use strict';

const BleBoxDevice = require('./bleboxdevice.js');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class SwitchBoxBaseDevice extends BleBoxDevice {

  /**
   * Override to return array of capability names for relays.
   * E.g. ['onoff'] for single relay, ['onoff.relay1','onoff.relay2'] for dual relay.
   */
  getRelayCapabilities() {
    return ['onoff'];
  }

  /**
   * Override to return the driver ID used in api.js webhook endpoint routing.
   * Must match the key in api.js exports (e.g. 'switchBox' routes to switchbox driver).
   */
  getWebhookDriverId() {
    return 'switchBox';
  }

  async onInit() {
    // Migration from v1: ensure polling_enabled exists for devices paired under old architecture
    if (!this.getSetting('polling_enabled')) {
      await this.setSettings({ polling_enabled: 'Yes' });
    }
    await super.onInit();
  }

  async onBleBoxInit() {
    const relayCaps = this.getRelayCapabilities();
    for (let i = 0; i < relayCaps.length; i++) {
      const relayIndex = i;
      this.registerCapabilityListener(relayCaps[i], async (value) => {
        await this.bbApi.switchBoxSetRelayState(this.getSetting('address'), relayIndex, value);
      });
    }

    // Dynamically detect and add power metering capabilities
    await this.detectPowerMeteringCapabilities();

    // Register webhooks if enabled
    if (this.getSetting('webhooks_enabled') === 'Yes') {
      await this.registerWebhooks();
    }
  }

  async detectPowerMeteringCapabilities() {
    try {
      const state = await this.bbApi.switchBoxGetState(this.getSetting('address'), this.getSetting('apiLevel'));
      if (!state || !state.powerMeasuring || state.powerMeasuring.enabled !== 1) {
        return;
      }

      const consumption = state.powerMeasuring.powerConsumption || [];
      const activePowerSensors = (state.sensors || []).filter((s) => s.type === 'activePower');

      if (consumption.length <= 1) {
        // Aggregate (single) power measurement
        if (!this.hasCapability('meter_power')) {
          await this.addCapability('meter_power');
        }
      } else {
        // Per-relay power measurement
        for (let i = 0; i < consumption.length; i++) {
          const cap = `meter_power.relay${i}`;
          if (!this.hasCapability(cap)) {
            await this.addCapability(cap);
            await this.setCapabilityOptions(cap, { title: { en: `Power consumption - Relay ${i + 1}` } });
          }
        }
      }

      if (activePowerSensors.length <= 1) {
        // Aggregate active power sensor
        if (activePowerSensors.length === 1) {
          if (!this.hasCapability('measure_power')) {
            await this.addCapability('measure_power');
          }
        }
      } else {
        // Per-relay active power sensors
        for (let i = 0; i < activePowerSensors.length; i++) {
          const cap = `measure_power.relay${i}`;
          if (!this.hasCapability(cap)) {
            await this.addCapability(cap);
            await this.setCapabilityOptions(cap, { title: { en: `Active power - Relay ${i + 1}` } });
          }
        }
      }
    } catch (err) {
      this.log('Could not detect power metering capabilities: ' + err);
    }
  }

  async registerWebhooks() {
    const myIp = await this.homey.cloud.getLocalAddress();
    const deviceId = this.getData().id;
    const address = this.getSetting('address');
    const driverId = this.getWebhookDriverId();
    const inputCount = this.getRelayCapabilities().length;

    const triggerTypes = [
      { type: 1, name: 'click' },
      { type: 2, name: 'clickLong' },
      { type: 3, name: 'fallingEdge' },
      { type: 4, name: 'risingEdge' },
      { type: 5, name: 'anyEdge' },
    ];

    let actionNo = 10; // Starting action ID, same convention as actionBox
    for (let input = 0; input < inputCount; input++) {
      for (const trigger of triggerTypes) {
        const url = `http://${myIp}/api/app/eu.blebox/${driverId}?device=${deviceId}&input=${input + 1}&action=${trigger.name}`;
        await this.bbApi.actionBoxRegisterWebhook(address, actionNo, input, trigger.type, url);
        await delay(300);
        actionNo++;
      }
    }
  }

  async pollBleBox() {
    await this.bbApi.switchBoxGetState(this.getSetting('address'), this.getSetting('apiLevel'))
      .then(async (result) => {
        const relayCaps = this.getRelayCapabilities();
        for (let i = 0; i < relayCaps.length; i++) {
          const state = result.relays[i].state === 1;
          if (state !== this.getCapabilityValue(relayCaps[i])) {
            await this.setCapabilityValue(relayCaps[i], state).catch((e) => this.log(e));
          }
        }

        // Update power metering - aggregate or per-relay
        if (result.powerMeasuring && result.powerMeasuring.enabled === 1) {
          const consumption = result.powerMeasuring.powerConsumption || [];
          if (consumption.length === 1 && this.hasCapability('meter_power')) {
            await this.setCapabilityValue('meter_power', consumption[0].value).catch((e) => this.log(e));
          } else {
            for (let i = 0; i < consumption.length; i++) {
              const cap = `meter_power.relay${i}`;
              if (this.hasCapability(cap)) {
                await this.setCapabilityValue(cap, consumption[i].value).catch((e) => this.log(e));
              }
            }
          }
        }

        const activePowerSensors = (result.sensors || []).filter((s) => s.type === 'activePower');
        if (activePowerSensors.length === 1 && this.hasCapability('measure_power')) {
          await this.setCapabilityValue('measure_power', activePowerSensors[0].value).catch((e) => this.log(e));
        } else {
          for (let i = 0; i < activePowerSensors.length; i++) {
            const cap = `measure_power.relay${i}`;
            if (this.hasCapability(cap)) {
              await this.setCapabilityValue(cap, activePowerSensors[i].value).catch((e) => this.log(e));
            }
          }
        }
      })
      .catch((error) => {
        this.log(error);
      });
  }

  // Flow card helpers
  async setRelay(relayIndex, value) {
    await this.bbApi.switchBoxSetRelayState(this.getSetting('address'), relayIndex, value);
  }

  async toggleRelay(relayIndex) {
    await this.bbApi.switchBoxToggleRelay(this.getSetting('address'), relayIndex);
  }

  isRelayOn(relayIndex) {
    return this.getCapabilityValue(this.getRelayCapabilities()[relayIndex]);
  }

  // Webhook event handlers
  async onButtonClicked(inputNo) {
    const card = this.homey.flow.getDeviceTriggerCard(`input${inputNo}_clicked`);
    await card.trigger(this, {}, {});
  }

  async onButtonClickedLong(inputNo) {
    const card = this.homey.flow.getDeviceTriggerCard(`input${inputNo}_clicked_long`);
    await card.trigger(this, {}, {});
  }

  async onButtonFallingEdge(inputNo) {
    const card = this.homey.flow.getDeviceTriggerCard(`input${inputNo}_falling_edge`);
    await card.trigger(this, {}, {});
  }

  async onButtonRisingEdge(inputNo) {
    const card = this.homey.flow.getDeviceTriggerCard(`input${inputNo}_rising_edge`);
    await card.trigger(this, {}, {});
  }

  async onButtonAnyEdge(inputNo) {
    const card = this.homey.flow.getDeviceTriggerCard(`input${inputNo}_any_edge`);
    await card.trigger(this, {}, {});
  }
}

module.exports = SwitchBoxBaseDevice;
