'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class windRainSensorProDevice extends BleBoxMDNSDevice {

  async pollBleBox() 
	{
    await this.bbApi.multiSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(result => {

      result.multiSensor.sensors.forEach(element => {
        if(element.type=='wind' && element.id == 0) 
          if(this.getCapabilityValue('measure_wind_strength')!=Math.fround(element.value/10*3.6)) 
            this.setCapabilityValue('measure_wind_strength', Math.fround(element.value/10*3.6))
            .catch( err => {
              this.log(err);
            });

          if(element.type=='windAvg' && element.id == 0) 
          if(this.getCapabilityValue('measure_wind_strength.avg1')!=Math.fround(element.value/10*3.6)) 
            this.setCapabilityValue('measure_wind_strength.avg1', Math.fround(element.value/10*3.6))
            .catch( err => {
              this.log(err);
            });
  
            
          if(element.type=='windMax' && element.id == 0) 
          if(this.getCapabilityValue('measure_gust_strength')!=Math.fround(element.value/10*3.6)) 
            this.setCapabilityValue('measure_gust_strength', Math.fround(element.value/10*3.6))
            .catch( err => {
              this.log(err);
            });
        
          if(element.type=='rain' && element.id == 0)
          { 
            if(this.getCapabilityValue('measure_rain')!=element.value) 
              this.setCapabilityValue('measure_rain', element.value)
              .catch( err => {
                this.log(err);
              });

            if(this.getCapabilityValue('alarm_water') && element.value==0)
            {
              this.setCapabilityValue('alarm_water', false)
              .catch( err => {
                this.log(err);
              });
            } 
            if(!this.getCapabilityValue('alarm_water') && element.value>0)
            {
              this.setCapabilityValue('alarm_water', true)
              .catch( err => {
                this.log(err);
              });
            } 
          }
        });


    })
  .catch(error => {
      this.log(error);
    })
	}

}

module.exports = windRainSensorProDevice;
