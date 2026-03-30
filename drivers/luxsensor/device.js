'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

class luxSensorDevice extends BleBoxDevice {

  async pollBleBox() {
    await this.bbApi.multiSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
      .then(async (result) => {
        for (const element of result.multiSensor.sensors) {
          if (element.value === null) continue;

          if (element.type === 'illuminance') {
            await this.setCapabilityValue('measure_luminance', element.value / 100)
              .catch((err) => this.log(err));
          }

          if (element.type === 'illuminanceAvg') {
            await this.setCapabilityValue('measure_luminance.avg', element.value / 100)
              .catch((err) => this.log(err));
          }

          if (element.type === 'illuminanceMax') {
            await this.setCapabilityValue('measure_luminance.max', element.value / 100)
              .catch((err) => this.log(err));
          }
        }
      })
      .catch((error) => this.log(error));
  }

}

module.exports = luxSensorDevice;
