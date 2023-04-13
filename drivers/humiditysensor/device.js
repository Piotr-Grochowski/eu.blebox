'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class humiditySensorDevice extends BleBoxMDNSDevice {

  async pollBleBox() 
	{
    // Read the device state
    await this.bbApi.multiSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(result => {

      result.multiSensor.sensors.forEach(element => {
        if(element.type=='temperature') 
          this.setCapabilityValue('measure_temperature', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='humidity') 
          this.setCapabilityValue('measure_humidity', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='absolute_humidity') 
          this.setCapabilityValue('measure_absolute_humidity', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='dew_point') 
          this.setCapabilityValue('measure_dew_point', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='heat_index') 
          this.setCapabilityValue('measure_heat_index', element.value/100)
          .catch( err => {
            this.log(err);
          });


      });
    })
    .catch(error => {
      this.log(error);
    })
	}
}

module.exports = humiditySensorDevice;
