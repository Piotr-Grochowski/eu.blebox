'use strict';
 
const { Driver } = require('homey');
const BleBoxAPI = require('./bleboxapi.js');

class BleBoxDriver_v2 extends Driver 
{
  // --------------- Driver settings ------------
  driverName = '';

  // API Type - to be set in onInitAddOn
  driverType = '';

  // Products limitation - to be set in onInitAddOn
  driverProduct = [];

  // If mDNS-SD is supported - to be set in onInitAddOn
  drivermDNSSDMethod = true;

  // If IP Address method is supported - to be set in onInitAddOn
  driverIPAddressMethod = true;

  // If actions integration is supported - to be set in onInitAddOn
  driverActions = true;

  // If polling integration is supported - to be set in onInitAddOn
  driverPolling = true;

  // Default polling interval - to be set in onInitAddOn
  driverPollingInterval = 1000;

  async onInit() 
  {
    this.onInitAddOn();

    // --------------- User defined settings ------------
    // Search type: 1 = mDNS-SD, 2 = IP Address
    if(this.drivermDNSSDMethod) 
      this.bleBoxMethod = 1
    else
      this.bleBoxMethod = 2;
    // IP Address for Method = 2
    this.bleBoxIPAddress = '0.0.0.0';
    // If user accepted actions integration
    this.bleBoxActions = this.driverActions;
    // If user accepter polling integration
    this.bleBoxPolling = this.driverPolling;
    // Polling interval set by the user
    this.bleBoxPollingInterval = this.driverPollingInterval;

    this.log(this.driverName+' has been initialized');
  }

  onInitAddOn()
  {
    // To be overridden
  }

  async onPair( session ) 
  {
    // Set starting values
    session.setHandler("showView", async (viewId) => {
      if (viewId === "add_blebox_device") 
      {
          const data = await session.emit("SetData", { 'mdns': this.drivermDNSSDMethod, 'ip_address': this.driverIPAddressMethod,
                                        'actions': this.driverActions, 'polling':this.driverPolling, 
                                        'interval': this.driverPollingInterval} );
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

    session.setHandler('list_devices', async () => {
      const bbApi = new BleBoxAPI();
      const devices = [];

      if(this.bleBoxMethod==1)
      {
        const discoveryStrategy = this.homey.discovery.getStrategy('bbxsrv');
        const discoveryResults = discoveryStrategy.getDiscoveryResults();
        
        for(const currDevice of Object.values(discoveryResults))
        {
          await bbApi.getDeviceState(currDevice.address)
          .then (result => 
          {
            if((this.driverType == '' || result.type==this.driverType) 
              && (this.driverProduct.length==0 || this.driverProduct.includes(result.product)))
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
                    poll_interval : !this.bleBoxPolling ? 500 : this.bleBoxPollingInterval,
                    polling_enabled: this.bleBoxPolling ? 'Yes' : 'No',
                    webhooks_enabled: this.bleBoxActions ? 'Yes' : 'No',
                    last_poll: '-',
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
            this.log(driverName+" error during device listing using mDNS-SD: "+err);
          }
          );
        }
      }
      else
      {
        await bbApi.getDeviceState(this.bleBoxIPAddress)
        .then (result => 
        {
          if((this.driverType == '' || result.type==this.driverType) 
            && (this.driverProduct.length==0 || this.driverProduct.includes(result.product)))
          {
            const apiLevel = result.hasOwnProperty('apiLevel') ? result.apiLevel : '20151206';
            devices.push(
              {
                name: result.deviceName,
                data: {
                  id: 'bbx-'+result.id
                },
                settings: 
                {
                  address: this.bleBoxIPAddress,
                  poll_interval : !this.bleBoxPolling ? 0 : this.bleBoxPollingInterval,
                  polling_enabled: this.bleBoxPolling ? 'Yes' : 'No',
                  webhooks_enabled: this.bleBoxActions ? 'Yes' : 'No',
                  last_poll: '-',
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
          this.log(driverName+" error during device listing using IP Address: "+err);
        }
        );
      }
      return devices;
    });


  }

}

module.exports = BleBoxDriver_v2;
