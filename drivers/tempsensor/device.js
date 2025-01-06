'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

class tempSensorDevice extends BleBoxDevice {

  async pollBleBox() 
	{
    await this.bbApi.tempSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(result => {

      let temperature = 0.00;

      result.tempSensor.sensors.forEach(element => {
        if(element.type=='temperature') temperature = element.value/100;
      });

      this.setCapabilityValue('measure_temperature', temperature)
        .catch( err => {
          this.log(err);
        });

    })
    .catch(error => {
      this.log(error);
    })
	}

}

module.exports = tempSensorDevice;
