'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

class tempSensorProDevice extends BleBoxDevice {

  async pollBleBox() 
	{
    // Read the device state
    await this.bbApi.multiSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(async result => {

      for (const element of result.multiSensor.sensors) {
        if(element.type=='temperature' && element.id == 0)
          await this.setCapabilityValue('measure_temperature.sensor1', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='temperature' && element.id == 1)
          await this.setCapabilityValue('measure_temperature.sensor2', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='temperature' && element.id == 2)
          await this.setCapabilityValue('measure_temperature.sensor3', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='temperature' && element.id == 3)
          await this.setCapabilityValue('measure_temperature.sensor4', element.value/100)
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

module.exports = tempSensorProDevice;
