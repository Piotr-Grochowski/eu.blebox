'use strict';

const { Device } = require('homey'); 
const BleBoxAPI = require('/lib/bleboxapi.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class airSensorDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.bbApi = new BleBoxAPI();
    this.polling = false;
    this.addListener('poll', this.pollDevice);

    this.log('airSensorDevice '.concat(this.getName(), ' has been initialized'));
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
     this.emit('poll');
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
     this.emit('poll');
   }
 
   /**
    * When device was offline and shows up again - reconnect
    */
   onDiscoveryLastSeenChanged(discoveryResult) 
   {
     this.emit('poll');
   }
  
   /**
    * polling to get the current state and energy values
    */
   async pollDevice() 
   {
     if(this.polling) return;
     this.polling = true;
     // First check current device settings (which may change e.g. after firmware upgrade)
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
      this.polling = false;
      console.log(error);
      this.error(error);
      return;
     })
  

     while (this.getAvailable() && this.polling) {

      await this.bbApi.airSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
      .then(result => {

				let pm1value = 0;
				let pm25value = 0;
				let pm10value = 0;

				result.air.sensors.forEach(element => {
					if(element.type=='pm1') pm1value = element.value;
					if(element.type=='pm2.5') pm25value = element.value;
					if(element.type=='pm10') pm10value = element.value;
				});

				this.setCapabilityValue('measure_pm25', pm25value)
					.catch( err => {
            this.polling = false;
						this.error(err);
					});

				this.setCapabilityValue('measure_pm1', pm1value)
					.catch( err => {
            this.polling = false;
						this.error(err);
					});

				this.setCapabilityValue('measure_pm10', pm10value)
					.catch( err => {
            this.polling = false;
						this.error(err);
					});
			})
			.catch(error => {
        this.polling = false;
        console.log(error);
        this.error(error);
				return;
			});					

      await delay(this.getSetting('poll_interval'));

     }  
     this.polling = false;
   }
 
   async onDeleted()
   {
    this.polling = false;
   }

}

module.exports = airSensorDevice;
