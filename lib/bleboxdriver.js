'use strict';
 
const { Driver } = require('homey');
const BleBoxAPI = require('./bleboxapi.js');

class BleBoxDriver extends Driver {

  async onInit() {
    this.bleBoxType = '';
    this.bleBoxProduct = ''; 
    this.bleBoxPoll = 1000;
    this.log('BleBoxDriver has been initialized');
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
        if((this.bleBoxType == '' || result.type==this.bleBoxType) && (this.bleBoxProduct == '' || result.product == this.bleBoxProduct))
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
        console.log(err);
      }
      );
    };
    return devices;
  }
}

module.exports = BleBoxDriver;
