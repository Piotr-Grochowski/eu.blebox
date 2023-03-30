'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class tempSensorDevice extends BleBoxMDNSDevice {

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
          this.log(error);
        });

    })
    .catch(error => {
      this.log(error);
    })
	}

}

module.exports = tempSensorDevice;
