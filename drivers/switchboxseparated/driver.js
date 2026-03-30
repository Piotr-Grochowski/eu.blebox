'use strict';

const BleBoxDriver_v2 = require('../../lib/bleboxdriver_v2.js');
const BleBoxAPI = require('../../lib/bleboxapi.js');

class switchBoxSeparatedDriver extends BleBoxDriver_v2 {

  onInitAddOn() {
    this.driverName = 'switchBoxSeparatedDriver';
    this.driverType = 'switchBox';
    this.driverProduct = [];
    this.drivermDNSSDMethod = true;
    this.driverIPAddressMethod = true;
    this.driverActions = true;
    this.driverPolling = true;
    this.driverPollingInterval = 1000;
  }

  async onPair(session) {
    // Standard v2 pairing handlers
    session.setHandler('showView', async (viewId) => {
      if (viewId === 'add_blebox_device') {
        await session.emit('SetData', {
          mdns: this.drivermDNSSDMethod,
          ip_address: this.driverIPAddressMethod,
          actions: this.driverActions,
          polling: this.driverPolling,
          interval: this.driverPollingInterval,
        });
      }
    });

    session.setHandler('methodChanged', async (data) => {
      this.bleBoxMethod = data;
    });

    session.setHandler('ipChanged', async (data) => {
      this.bleBoxIPAddress = data;
    });

    session.setHandler('actionsChanged', async (data) => {
      this.bleBoxActions = data;
    });

    session.setHandler('pollingChanged', async (data) => {
      this.bleBoxPolling = data;
    });

    session.setHandler('intervalChanged', async (data) => {
      this.bleBoxPollingInterval = data;
    });

    // Custom list_devices: split each physical device into per-relay Homey devices
    session.setHandler('list_devices', async () => {
      const bbApi = new BleBoxAPI();
      const devices = [];

      const addDeviceRelays = async (address, deviceId, deviceInfo) => {
        const apiLevel = deviceInfo.hasOwnProperty('apiLevel') ? deviceInfo.apiLevel : '20151206';
        // Query extended state to get relay count
        let relayCount = 1;
        try {
          const state = await bbApi.switchBoxGetState(address, apiLevel);
          if (state && state.relays) {
            relayCount = state.relays.length;
          }
        } catch (err) {
          this.log('Could not get relay count, defaulting to 1: ' + err);
        }

        for (let i = 0; i < relayCount; i++) {
          const relayLabel = relayCount > 1 ? ` - Relay ${i + 1}` : '';
          devices.push({
            name: deviceInfo.deviceName + relayLabel,
            data: {
              id: deviceId + '_relay' + i,
            },
            store: {
              relayIndex: i,
              relayCount: relayCount,
            },
            settings: {
              address: address,
              poll_interval: !this.bleBoxPolling ? 500 : this.bleBoxPollingInterval,
              polling_enabled: this.bleBoxPolling ? 'Yes' : 'No',
              webhooks_enabled: this.bleBoxActions ? 'Yes' : 'No',
              last_poll: '-',
              product: deviceInfo.product,
              apiLevel: apiLevel,
              hv: deviceInfo.hv,
              fv: deviceInfo.fv,
            },
          });
        }
      };

      if (this.bleBoxMethod === 1) {
        const discoveryStrategy = this.homey.discovery.getStrategy('bbxsrv');
        const discoveryResults = discoveryStrategy.getDiscoveryResults();

        for (const currDevice of Object.values(discoveryResults)) {
          await bbApi.getDeviceState(currDevice.address)
            .then(async (result) => {
              if ((this.driverType === '' || result.type === this.driverType)
                && (this.driverProduct.length === 0 || this.driverProduct.includes(result.product))) {
                await addDeviceRelays(currDevice.address, currDevice.id, result);
              }
            })
            .catch((err) => {
              this.log(this.driverName + ' error during device listing using mDNS-SD: ' + err);
            });
        }
      } else {
        await bbApi.getDeviceState(this.bleBoxIPAddress)
          .then(async (result) => {
            if ((this.driverType === '' || result.type === this.driverType)
              && (this.driverProduct.length === 0 || this.driverProduct.includes(result.product))) {
              await addDeviceRelays(this.bleBoxIPAddress, 'bbx-' + result.id, result);
            }
          })
          .catch((err) => {
            this.log(this.driverName + ' error during device listing using IP Address: ' + err);
          });
      }

      return devices;
    });
  }
}

module.exports = switchBoxSeparatedDriver;
