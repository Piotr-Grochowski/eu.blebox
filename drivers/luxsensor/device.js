'use strict';

const BleBoxDevice = require('../../lib/bleboxdevice.js');

class luxSensorDevice extends BleBoxDevice {

  async pollBleBox() {
    await this.bbApi.multiSensorGetState(this.getSetting('address'), this.getSetting('apiLevel'))
      .then((result) => {
        result.multiSensor.sensors.forEach((element) => {
          if (element.value === null) return;

          if (element.type === 'illuminance') {
            this.setCapabilityValue('measure_luminance', element.value / 100)
              .catch((err) => this.log(err));
          }

          if (element.type === 'illuminanceAvg') {
            this.setCapabilityValue('measure_luminance.avg', element.value / 100)
              .catch((err) => this.log(err));
          }

          if (element.type === 'illuminanceMax') {
            this.setCapabilityValue('measure_luminance.max', element.value / 100)
              .catch((err) => this.log(err));
          }
        });
      })
      .catch((error) => this.log(error));
  }

}

module.exports = luxSensorDevice;
