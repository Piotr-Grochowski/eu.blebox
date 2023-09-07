'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class proxiBoxDevice extends BleBoxMDNSDevice {

  async onBleBoxInit()
  {
    const myIp = await this.homey.cloud.getLocalAddress();

    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),25 , 0, 1, 'http://'+myIp+'/api/app/eu.blebox/proxiBox?device='+this.getData().id+'&action=click');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),26 , 0, 2, 'http://'+myIp+'/api/app/eu.blebox/proxiBox?device='+this.getData().id+'&action=clickLong');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),27 , 0, 3, 'http://'+myIp+'/api/app/eu.blebox/proxiBox?device='+this.getData().id+'&action=fallingEdge');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),28 , 0, 4, 'http://'+myIp+'/api/app/eu.blebox/proxiBox?device='+this.getData().id+'&action=risingEdge');
    await delay(300);
    await this.bbApi.actionBoxRegisterWebhook(this.getSetting("address"),29 , 0, 5, 'http://'+myIp+'/api/app/eu.blebox/proxiBox?device='+this.getData().id+'&action=anyEdge');
  }

  async pollBleBox() 
	{

	}

  async onButtonClicked()
  {
    const buttonClicked = this.homey.flow.getDeviceTriggerCard('proxi_clicked');
    await buttonClicked.trigger(this,{},{});
  }

  async onButtonClickedLong()
  {
    const buttonClickedLong = this.homey.flow.getDeviceTriggerCard('proxi_clicked_long');
    await buttonClickedLong.trigger(this,{},{});
  }

  async onButtonFallingEdge()
  {
    const buttonFallingEdge = this.homey.flow.getDeviceTriggerCard('proxi_falling_edge');
    await buttonFallingEdge.trigger(this,{},{});
  }

  async onButtonRisingEdge()
  {
    const buttonRisingEdge = this.homey.flow.getDeviceTriggerCard('proxi_rising_edge');
    await buttonRisingEdge.trigger(this,{},{});
  }

  async onButtonAnyEdge()
  {
    const buttonAnyEdge = this.homey.flow.getDeviceTriggerCard('proxi_any_edge');
    await buttonAnyEdge.trigger(this,{},{});
  }
}

module.exports = proxiBoxDevice;
