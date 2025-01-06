'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class floodSensorDevice extends BleBoxDevice {


  async onBleBoxInit()
  {
    if(this.getSetting('webhooks_enabled')=='Yes')
    {
      const myIp = await this.homey.cloud.getLocalAddress();

      await this.bbApi.floodSensorRegisterWebhook(this.getSetting("address"),28, 24, 'http://'+myIp+'/api/app/eu.blebox/floodSensor?device='+this.getData().id+'&action=flood')
      .catch( err => {
        this.log(err);
      });
      await delay(300);
      await this.bbApi.floodSensorRegisterWebhook(this.getSetting("address"),29, 25, 'http://'+myIp+'/api/app/eu.blebox/floodSensor?device='+this.getData().id+'&action=noflood')
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

  async onFlood()
  {
    if(!this.getCapabilityValue('alarm_water'))
      {
        this.setCapabilityValue('alarm_water', true)
        .catch( err => {
          this.log(err);
        });
      } 
  }

  async onNoFlood()
  {
    if(this.getCapabilityValue('alarm_water'))
      {
        this.setCapabilityValue('alarm_water', false)
        .catch( err => {
          this.log(err);
        });
      } 
  }

}

module.exports = floodSensorDevice;
