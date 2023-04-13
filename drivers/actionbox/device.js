'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class actionBoxDevice extends BleBoxMDNSDevice {

  async onBleBoxInit()
  {
    const myIp = await this.homey.cloud.getLocalAddress();

    // input 1
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),10 , 0, 1, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=1&action=click');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),11 , 0, 2, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=1&action=clickLong');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),12 , 0, 3, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=1&action=fallingEdge');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),13 , 0, 4, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=1&action=risingEdge');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),14 , 0, 5, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=1&action=anyEdge');
    await delay(300);

    // input 2
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),15 , 1, 1, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=2&action=click');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),16 , 1, 2, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=2&action=clickLong');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),17 , 1, 3, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=2&action=fallingEdge');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),18 , 1, 4, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=2&action=risingEdge');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),19 , 1, 5, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=2&action=anyEdge');
    await delay(300);

    // input 3
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),20 , 2, 1, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=3&action=click');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),21 , 2, 2, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=3&action=clickLong');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),22 , 2, 3, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=3&action=fallingEdge');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),23 , 2, 4, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=3&action=risingEdge');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),24 , 2, 5, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=3&action=anyEdge');
    await delay(300);
    
    // input 4
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),25 , 3, 1, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=4&action=click');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),26 , 3, 2, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=4&action=clickLong');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),27 , 3, 3, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=4&action=fallingEdge');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),28 , 3, 4, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=4&action=risingEdge');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),29 , 3, 5, 'http://'+myIp+'/api/app/eu.blebox/actionBox?device='+this.getData().id+'&input=4&action=anyEdge');
  }

  async pollBleBox() 
	{

	}

  async onButtonClicked(inputNo)
  {
    const buttonClicked = this.homey.flow.getDeviceTriggerCard('button'+inputNo+'_clicked');
    await buttonClicked.trigger(this,{},{});
  }

  async onButtonClickedLong(inputNo)
  {
    const buttonClickedLong = this.homey.flow.getDeviceTriggerCard('button'+inputNo+'_clicked_long');
    await buttonClickedLong.trigger(this,{},{});
  }

  async onButtonFallingEdge(inputNo)
  {
    const buttonFallingEdge = this.homey.flow.getDeviceTriggerCard('button'+inputNo+'_falling_edge');
    await buttonFallingEdge.trigger(this,{},{});
  }

  async onButtonRisingEdge(inputNo)
  {
    const buttonRisingEdge = this.homey.flow.getDeviceTriggerCard('button'+inputNo+'_rising_edge');
    await buttonRisingEdge.trigger(this,{},{});
  }

  async onButtonAnyEdge(inputNo)
  {
    const buttonAnyEdge = this.homey.flow.getDeviceTriggerCard('button'+inputNo+'_any_edge');
    await buttonAnyEdge.trigger(this,{},{});
  }
}

module.exports = actionBoxDevice;
