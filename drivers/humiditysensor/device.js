'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

class humiditySensorDevice extends BleBoxDevice {

  async pollBleBox() 
	{
    // Read the device state
    await this.bbApi.multiSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(async result => {

      for (const element of result.multiSensor.sensors) {
        if(element.type=='temperature')
          await this.setCapabilityValue('measure_temperature', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='humidity')
          await this.setCapabilityValue('measure_humidity', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='absolute_humidity')
          await this.setCapabilityValue('measure_absolute_humidity', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='dew_point')
          await this.setCapabilityValue('measure_dew_point', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='heat_index')
          await this.setCapabilityValue('measure_heat_index', element.value/100)
          .catch( err => {
            this.log(err);
          });


      }
    })
    .catch(error => {
      this.log(error);
    })
	}
}

module.exports = humiditySensorDevice;
