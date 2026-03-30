'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

class windSensorProDevice extends BleBoxDevice {

  async pollBleBox() 
	{
    await this.bbApi.multiSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(async result => {

      for (const element of result.multiSensor.sensors) {
        if(element.type=='wind' && element.id == 0)
          if(this.getCapabilityValue('measure_wind_strength')!=Math.fround(element.value/10*3.6))
            await this.setCapabilityValue('measure_wind_strength', Math.fround(element.value/10*3.6))
            .catch( err => {
              this.log(err);
            });

          if(element.type=='windAvg' && element.id == 0)
          if(this.getCapabilityValue('measure_wind_strength.avg')!=Math.fround(element.value/10*3.6))
            await this.setCapabilityValue('measure_wind_strength.avg', Math.fround(element.value/10*3.6))
            .catch( err => {
              this.log(err);
            });


          if(element.type=='windMax' && element.id == 0)
          if(this.getCapabilityValue('measure_gust_strength')!=Math.fround(element.value/10*3.6))
            await this.setCapabilityValue('measure_gust_strength', Math.fround(element.value/10*3.6))
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

module.exports = windSensorProDevice;
