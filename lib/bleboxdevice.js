'use strict';

const { Device } = require('homey');
const BleBoxAPI = require('./bleboxapi.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class BleBoxDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.bbApi = new BleBoxAPI();
    this.polling = false;

    await this.onBleBoxInit();

    if(this.getSetting('polling_enabled')=='Yes')
    {
      this.addListener('poll', this.pollDevice);
      this.emit('poll');
    }
    else
    {
      this.setAvailable();
      // First check current device settings (which may change e.g. after firmware upgrade)
      await this.bbApi.getDeviceState(this.getSetting('address'))
      .then(async result => {
        try {
          await this.setSettings(
            {
              product: result.product != null ? String(result.product) : 'n/a',
              hv: result.hv != null ? String(result.hv) : 'n/a',
              fv: result.fv != null ? String(result.fv) : 'n/a',
              apiLevel: result.apiLevel != null ? String(result.apiLevel) : 'n/a'
            }
          )
        } catch(err) { this.log('setSettings error:', err.message); }
      })
      .catch(error => {
        this.log(error);
      })

    }

    this.log(this.getName().concat(' has been initialized'));
  }

  async onBleBoxInit()
  {
    // To be overridden if additional initialization needed
  }

  /**
   * polling to get the current state and energy values
   */
  async pollDevice()
	{
    if(this.polling) return;
    this.polling = true;
    while(this.polling)
    {
      try {
        // First check current device settings (which may change e.g. after firmware upgrade)
        await this.bbApi.getDeviceState(this.getSetting('address'))
        .then(async result => {
          this.setAvailable();
          // Only update settings when values actually changed (avoid constant setSettings calls)
          const newProduct = result.product != null ? String(result.product) : 'n/a';
          const newHv = result.hv != null ? String(result.hv) : 'n/a';
          const newFv = result.fv != null ? String(result.fv) : 'n/a';
          const newApiLevel = result.apiLevel != null ? String(result.apiLevel) : 'n/a';
          if (newProduct !== this.getSetting('product')
            || newHv !== this.getSetting('hv')
            || newFv !== this.getSetting('fv')
            || newApiLevel !== this.getSetting('apiLevel')) {
            try {
              await this.setSettings({
                product: newProduct,
                hv: newHv,
                fv: newFv,
                apiLevel: newApiLevel
              });
            } catch(err) { this.log('setSettings error:', err.message); }
          }
        })
        .catch(error => {
          this.setUnavailable();
          this.log(error);
        })

        if(this.getAvailable())
        {
          await this.pollBleBox()
          .catch(error => {
            this.setUnavailable();
            this.log(error);
          })
        }
      } catch(err) {
        this.log('Unexpected error in poll loop:', err);
      }

      const interval = this.getSetting('poll_interval');
      if(this.getAvailable())
        await delay(interval > 0 ? interval : 1000);
      else
        await delay(60000);
    }
    this.polling = false;
	}

  async pollBleBox()
  {
    // to be overridden
  }

  async onDeleted()
  {
   this.polling = false;
  }


}

module.exports = BleBoxDevice;
