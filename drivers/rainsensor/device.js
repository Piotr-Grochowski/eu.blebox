'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class rainSensorDevice extends BleBoxDevice {

  async onBleBoxInit()
  {
    if(this.getSetting('webhooks_enabled')=='Yes')
    {
      const myIp = await this.homey.cloud.getLocalAddress();

      await this.bbApi.rainSensorRegisterWebhook(this.getSetting("address"),28, 11, 'http://'+myIp+'/api/app/eu.blebox/rainSensor?device='+this.getData().id+'&action=rain')
      .catch( err => {
        this.log(err);
      });
      await delay(300);
      await this.bbApi.rainSensorRegisterWebhook(this.getSetting("address"),29, 12, 'http://'+myIp+'/api/app/eu.blebox/rainSensor?device='+this.getData().id+'&action=norain')
      .catch( err => {
        this.log(err);
      });

    }
  }
  
  async pollBleBox() 
	{
    await this.bbApi.multiSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(result => {

      result.multiSensor.sensors.forEach(element => {
        if(element.type=='rain' && element.id == 0) 
          if(this.getCapabilityValue('measure_rain')!=element.value) 
            this.setCapabilityValue('measure_rain', element.value)
            .catch( err => {
              this.log(err);
            });
          if(element.type=='rain' && element.id == 0 && this.getCapabilityValue('alarm_water') && element.value==0)
          {
            this.setCapabilityValue('alarm_water', false)
            .catch( err => {
              this.log(err);
            });
          } 
          if(element.type=='rain' && element.id == 0 && !this.getCapabilityValue('alarm_water') && element.value>0)
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

  async onRain()
  {
    if(!this.getCapabilityValue('alarm_water'))
    {
      this.setCapabilityValue('alarm_water', true)
      .catch( err => {
        this.log(err);
      });
    } 
    if(this.getCapabilityValue('measure_rain')!=1) 
      this.setCapabilityValue('measure_rain', 1)
      .catch( err => {
        this.log(err);
      });
}

  async onNoRain()
  {
    if(this.getCapabilityValue('alarm_water'))
    {
      this.setCapabilityValue('alarm_water', false)
      .catch( err => {
        this.log(err);
      });
    } 
    if(this.getCapabilityValue('measure_rain')!=0) 
      this.setCapabilityValue('measure_rain', 0)
      .catch( err => {
        this.log(err);
      });
  }


}

module.exports = rainSensorDevice;
