'use strict';

const { Device } = require('homey');
const BleBoxAPI = require('../../lib/bleboxapi.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class tempSensorDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.bbApi = new BleBoxAPI();
//    this.polling = false;
    this.addListener('poll', this.pollDevice);

    this.log('tempSensorDevice '.concat(this.getName(), ' has been initialized'));
    this.emit('poll');

  }

  /**
   * if the discovered device is this device - return true
   */
   onDiscoveryResult(discoveryResult) 
  {
    return discoveryResult.id === this.getData().id;
  }

  /**
   * This method will be executed once when the device has been found (onDiscoveryResult returned true)
   */
   async onDiscoveryAvailable(discoveryResult) 
  {
//    this.emit('poll');
  }

  /**
   * Update the address and reconnect
   */
   onDiscoveryAddressChanged(discoveryResult) 
  {
    this.setSettings(
      {
        address: discoveryResult.address
      });

//    this.emit('poll');
  }

  /**
   * When device was offline and shows up again - reconnect
   */
   onDiscoveryLastSeenChanged(discoveryResult) 
  {
//    this.emit('poll');
  }

  /**
   * polling to get the current state and energy values
   */
  async pollDevice() 
	{
    this.polling = true;
    while(this.polling)
    {
    //    if(this.polling) return;
    //    this.polling = true;
      // First check current device settings (which may change e.g. after firmware upgrade)
      if(this.getAvailable())
      {
        await this.bbApi.getDeviceState(this.getSetting('address'))
        .then(result => {
          this.setSettings(
            {
              product: result.product,
              hv: result.hv,
              fv: result.fv,
              apiLevel: result.apiLevel
            }
          )
        })
        .catch(error => {
//          this.polling = false;
          console.log(error);
//          this.error(error);
//          return;
        })

//        while (this.getAvailable() && this.polling) {
          // Read the device state
          await this.bbApi.tempSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
          .then(result => {

            let temperature = 0.00;
      
            result.tempSensor.sensors.forEach(element => {
              if(element.type=='temperature') temperature = element.value/100;
            });
      
            this.setCapabilityValue('measure_temperature', temperature)
              .catch( err => {
                console.log(error);
//                this.error(err);
              });

          })
          .catch(error => {
//            this.polling = false;
            console.log(error);
//            this.error(error);
//            return;
          })
          await delay(this.getSetting('poll_interval'));
//        }  
//        this.polling = false;
      }
    }
	}

  async onDeleted()
  {
   this.polling = false;
  }


}

module.exports = tempSensorDevice;
