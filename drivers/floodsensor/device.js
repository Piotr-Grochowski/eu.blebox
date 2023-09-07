'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class floodSensorDevice extends BleBoxMDNSDevice {

  async pollBleBox() 
	{
    await this.bbApi.multiSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(result => {

      result.multiSensor.sensors.forEach(element => {
          if(this.getCapabilityValue('alarm_water') && element.type == 'flood' && element.value==0)
          {
            this.setCapabilityValue('alarm_water', false)
            .catch( err => {
              this.log(err);
            });
          } 
          if(!this.getCapabilityValue('alarm_water') && element.type == 'flood' && element.value>0)
          {
            this.setCapabilityValue('alarm_water', true)
            .catch( err => {
              this.log(err);
            });
          } 
      });

    })
  .catch(error => {
      this.log(error);
    })
	}

}

module.exports = floodSensorDevice;
