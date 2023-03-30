'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class rainSensorDevice extends BleBoxMDNSDevice {

  async pollBleBox() 
	{
    await this.bbApi.multiSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(result => {

      result.multiSensor.sensors.forEach(element => {
        if(element.type=='rain' && element.id == 0) 
          this.setCapabilityValue('measure_rain', element.value)
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

module.exports = rainSensorDevice;
