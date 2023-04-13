'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class tempSensorACDevice extends BleBoxMDNSDevice {

  async pollBleBox() 
	{
    // Read the device state
    await this.bbApi.multiSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(result => {

      result.multiSensor.sensors.forEach(element => {
        if(element.type=='temperature' && element.id == 0) 
          this.setCapabilityValue('measure_temperature.sens1', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='temperature' && element.id == 1) 
          this.setCapabilityValue('measure_temperature.sens2', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='temperature' && element.id == 2) 
          this.setCapabilityValue('measure_temperature.sens3', element.value/100)
          .catch( err => {
            this.log(err);
          });

          if(element.type=='temperature' && element.id == 3) 
          this.setCapabilityValue('measure_temperature.sens4', element.value/100)
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

module.exports = tempSensorACDevice;
