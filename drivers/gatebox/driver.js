'use strict';
 
const { Driver } = require('homey');
const BleBoxAPI = require('../../lib/bleboxapi.js');

class gateBoxDriver extends Driver {

  async onInit() {
    this.bleBoxPoll = 1000;
    this.log('gateBoxDriver has been initialized');
  }

  async onPairListDevices() {
    const discoveryStrategy = this.getDiscoveryStrategy();
    const discoveryResults = discoveryStrategy.getDiscoveryResults();
    const bbApi = new BleBoxAPI();

    const devices = [];
    
    for(const currDevice of Object.values(discoveryResults))
    {
      await bbApi.getDeviceState(currDevice.address)
      .then (result => 
      {
        if((result.type=='gateBox') && (result.product == 'gateBox' || result.product == 'RiCo' || result.product == 'doorBox_v2'))
        {
          const apiLevel = result.hasOwnProperty('apiLevel') ? result.apiLevel : '20151206';
          devices.push(
            {
              name: result.deviceName,
              data: {
                id: currDevice.id
              },
              settings: 
              {
                address: currDevice.address,
                poll_interval : this.bleBoxPoll,
                product: result.product,
                apiLevel: apiLevel,
                hv: result.hv,
                fv: result.fv
              }
            }
          );
          return;
        }
      })
      .catch(err => {
        this.log(err);
      }
      );
    };
    return devices;
  }
}

module.exports = gateBoxDriver;
