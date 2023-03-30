'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class airSensorDevice extends BleBoxMDNSDevice {

  async pollBleBox() 
	{
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
      this.log(error);
    })
	}

}

module.exports = airSensorDevice;
