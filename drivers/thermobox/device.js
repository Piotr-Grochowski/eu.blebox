'use strict';

const BleBoxMDNSDevice = require('../../lib/bleboxmdnsdevice.js');

class thermoBoxDevice extends BleBoxMDNSDevice {

  async onBleBoxInit()
  {
		this.registerCapabilityListener('target_hightemperature', this.onCapabilityTargetTemperature.bind(this));
		this.registerCapabilityListener('thermostat_state', this.onCapabilityThermostatState.bind(this));
  }

  async pollBleBox() 
	{
    // Read the device state
    await this.bbApi.thermoBoxGetExtendedState(this.getSetting('address'), this.getSetting('apiLevel'))
    .then(result => {
      // On success - update Homey's device state
      if (result.thermo.desiredTemp/100 != this.getCapabilityValue('target_hightemperature')) {
        this.setCapabilityValue('target_hightemperature', result.thermo.desiredTemp/100)
          .catch( err => {
            this.log(err);
          })   
      }

      if (result.thermo.desiredTemp/100 != this.getCapabilityValue('measure_temperature.target')) {
        this.setCapabilityValue('measure_temperature.target', result.thermo.desiredTemp/100)
          .catch( err => {
            this.log(err);
          })   
      }

      if (result.thermo.state.toString() != this.getCapabilityValue('thermostat_state')) {
        this.setCapabilityValue('thermostat_state', result.thermo.state.toString())
          .catch( err => {
            this.log(err);
          })   
      }

      switch(result.thermo.operatingState)
      {
        case 0:
          this.setCapabilityValue('measure_power', this.getSetting('power_idle'));
          break;
        case 1:
          this.setCapabilityValue('measure_power', this.getSetting('power_on'));
          break;
        case 2:
          this.setCapabilityValue('measure_power', this.getSetting('power_on'));
          break;
        case 3:
          this.setCapabilityValue('measure_power', this.getSetting('power_boost'));
          break;
      }

      result.sensors.forEach(element => {
        if((result.thermo.safetyTempSensor.sensorId == null && element.type=='temperature' ) ||
            (result.thermo.safetyTempSensor.sensorId != null && element.type=='temperature' && element.id != 
            result.thermo.safetyTempSensor.sensorId))
          this.setCapabilityValue('measure_temperature', element.value / 100)
          .catch( err => {
            this.log(err);
          });
        
        if(result.thermo.safetyTempSensor.sensorId != null && element.type=='temperature' && element.id == result.thermo.safetyTempSensor.sensorId) 
          this.setCapabilityValue('measure_temperature.safety', element.value / 100)
          .catch( err => {
            this.log(err);
          });

      });
    })
    .catch(error => {
      this.log(error);
    })
	}

  /**
   * Send the target temperature
   */
	async onCapabilityTargetTemperature( value, opts ) 
  {
    this.bbApi.thermoBoxSetTargetTemperature(this.getSetting('address'),value)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
    });
  }

  /**
   * Send the thermostat state
   */
	async onCapabilityThermostatState( value, opts ) 
  {
    this.bbApi.thermoBoxSetState(this.getSetting('address'),value)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
    });
  }

  async setThermostatStateTo(value)
  {
    this.bbApi.thermoBoxSetState(this.getSetting('address'),value)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
    });
  }

  async setTargetTemperature( value ) 
  {
    this.bbApi.thermoBoxSetTargetTemperature(this.getSetting('address'),value)
    .catch(error => {
      // Error occured
      this.log(error);
      this.error(error);
      return;
    });
  }

}

module.exports = thermoBoxDevice;
