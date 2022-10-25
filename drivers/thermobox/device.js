'use strict';

const { Device } = require('homey');
const BleBoxAPI = require('/lib/bleboxapi.js')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class thermoBoxDevice extends Device {

  /**
   * device init
   */
  async onInit() 
  {
    this.bbApi = new BleBoxAPI();
    this.polling = false;
    this.addListener('poll', this.pollDevice);

		// register a capability listener
		this.registerCapabilityListener('target_temperature', this.onCapabilityTargetTemperature.bind(this));
		this.registerCapabilityListener('thermostat_state', this.onCapabilityThermostatState.bind(this));

    this.log('thermoBox '.concat(this.getName(), ' has been initialized'));
  }

  /**
   * if the discovered device is this device - return true
   */
   onDiscoveryResult(discoveryResult) 
  {
    return discoveryResult.id === this.getData().id;
  }

  /**
   * This method will be executed once when the device has been found (onDiscoveryResult returned true)
   */
   async onDiscoveryAvailable(discoveryResult) 
  {
    this.emit('poll');
  }

  /**
   * Update the address and reconnect
   */
   onDiscoveryAddressChanged(discoveryResult) 
  {
    this.setSettings(
      {
        address: discoveryResult.address
      });

    this.emit('poll');
  }

  /**
   * When device was offline and shows up again - reconnect
   */
   onDiscoveryLastSeenChanged(discoveryResult) 
  {
    this.emit('poll');
  }

  /**
   * polling to get the current state and energy values
   */
  async pollDevice() 
	{
    if(this.polling) return;
    this.polling = true;
   // First check current device settings (which may change e.g. after firmware upgrade)
    await this.bbApi.getDeviceState(this.getSetting('address'))
    .then(result => {
      this.setSettings(
        {
          product: result.product,
          hv: result.hv,
          fv: result.fv,
          apiLevel: result.apiLevel
        }
      )
    })
    .catch(error => {
      this.polling = false;
      console.log(error);
      this.error(error);
      return;
    })

		while (this.getAvailable() && this.polling) {
			// Read the device state
			await this.bbApi.thermoBoxGetExtendedState(this.getSetting('address'), this.getSetting('apiLevel'))
			.then(result => {
				// On success - update Homey's device state
				if (result.thermo.desiredTemp/100 != this.getCapabilityValue('target_temperature')) {
					this.setCapabilityValue('target_temperature', result.thermo.desiredTemp/100)
						.catch( err => {
              this.polling = false;
							this.error(err);
						})   
				}

				if (result.thermo.state.toString() != this.getCapabilityValue('thermostat_state')) {
					this.setCapabilityValue('thermostat_state', result.thermo.state.toString())
						.catch( err => {
              this.polling = false;
							this.error(err);
						})   
				}
        
				result.sensors.forEach(element => {
					if((result.thermo.safetyTempSensor.sensorId == null && element.type=='temperature' ) ||
             (result.thermo.safetyTempSensor.sensorId != null && element.type=='temperature' && element.id != 
              result.thermo.safetyTempSensor.sensorId))
            this.setCapabilityValue('measure_temperature', element.value / 100)
					  .catch( err => {
						  this.error(err);
					  });
          
					if(result.thermo.safetyTempSensor.sensorId != null && element.type=='temperature' && element.id == result.thermo.safetyTempSensor.sensorId) 
            this.setCapabilityValue('measure_temperature.safety', element.value / 100)
					  .catch( err => {
						  this.error(err);
					  });

				});
			})
			.catch(error => {
        this.polling = false;
				console.log(error);
        this.error(error);
				return;
			})
			await delay(this.getSetting('poll_interval'));
		}  
    this.polling = false;
	}

  /**
   * Send the target temperature
   */
	async onCapabilityTargetTemperature( value, opts ) 
  {
    await this.bbApi.thermoBoxSetTargetTemperature(this.getSetting('address'),value);
  }

  /**
   * Send the thermostat state
   */
	async onCapabilityThermostatState( value, opts ) 
  {
    await this.bbApi.thermoBoxSetState(this.getSetting('address'),value);
  }


   async onDeleted()
   {
    this.polling = false;
   }


}

module.exports = thermoBoxDevice;
