const util = require('/lib/util.js');


module.exports = class BleBoxAPI 
{
    /*
     *  getDeviceState -> common method for all BleBox devices to get their info
     */
    async getDeviceState(ip)
    {
        return new Promise(function(resolve, reject)
        {
			// GET /api/device/state - should work for API Levels: 20200831, 20200229, 20190808, 20180604
			util.sendGetCommand('/api/device/state',ip)
			.then(result => {
                if(result.hasOwnProperty('device'))
                    return resolve(result.device)
                else   
                    return resolve(result);
			})
			.catch(error => {
                // GET /info for other devices
                util.sendGetCommand('/info',ip)
                .then(result => {
                    if(result.hasOwnProperty('device'))
                        return resolve(result.device)
                    else   
                        return resolve(result);
                })
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
            })
        });
	};

    /*
     *  getDeviceStateAuth -> common method for all BleBox devices that use authorisation to get their info
     */
        async getDeviceStateAuth(ip, username, password)
        {
            return new Promise(function(resolve, reject)
            {
                // GET /api/device/state - should work for API Levels: 20200831, 20200229, 20190808, 20180604
                util.sendGetCommandAuth('/api/device/state',ip,username,password)
                .then(result => {
                    if(result.hasOwnProperty('device'))
                        return resolve(result.device)
                    else   
                        return resolve(result);
                })
                .catch(error => {
                    // GET /info for other devices
                    util.sendGetCommand('/info',ip)
                    .then(result => {
                        if(result.hasOwnProperty('device'))
                            return resolve(result.device)
                        else   
                            return resolve(result);
                    })
                    .catch(error => {
                        console.log(error);
                        return reject(error);
                    })
                })
            });
        };
    
    /*
     *  switchBoxGetState -> for switchBox and switchBoxD API types - get state of the relays and power meter (if available in the hardware)
     */
    async switchBoxGetState(ip, apiV)
    {
        return new Promise(function(resolve, reject)
        {
            if(apiV == '20200831' || apiV =='20200229')
            {
                // GET /state/extended -> API Level: 20200831, 20200229
                util.sendGetCommand('/state/extended',ip)
                .then(result => {
                    return resolve(result);    
                })
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
            }
            if(apiV == '20190808' || apiV == '20180604')
            {
                // GET /api/relay/extended/state -> API Level: 20190808, 20180604
                util.sendGetCommand('/api/relay/extended/state',ip)
                .then(result => {
                    return resolve(result);    
                })
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
            }
        }); 
    }

    /*
     *  switchBoxGetState -> for switchBox and switchBoxD API types - get state of the relays and power meter (if available in the hardware)
     */
    async switchBoxDGetState(ip, apiV)
    {
        return new Promise(function(resolve, reject)
        {
            if(apiV == '20200831' || apiV =='20200229')
            {
                // GET /state/extended -> API Level: 20200831, 20200229
                util.sendGetCommand('/state/extended',ip)
                .then(result => {
                    return resolve(result);    
                })
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
            }
            if(apiV == '20190808' || apiV == '20180604')
            {
                // GET /api/relay/extended/state -> API Level: 20190808, 20180604
                util.sendGetCommand('/api/relay/extended/state',ip)
                .then(result => {
                    return resolve(result);    
                })
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
            }
        }); 
    }

    /*
     * switchBoxSetState - for switchBox API type - set relay to on or off
     */
    async switchBoxSetState(ip, state)
    {

        return new Promise(function(resolve, reject)
        {
            const cmd = state == true ? '/s/1' : '/s/0';

			// SET /s/* -> API Level: 20200831, 20200229, 20190808, 20180604
            util.sendGetCommand(cmd,ip)
            .catch(error => {
                console.log(error);
                return reject(error);
            })
            return resolve();
        }); 
    }

    /*
     * switchBoxDSetState - for switchBoxD API type - set one of the relays to on or off
     */
    async switchBoxDSetState(ip, relay, state)
    {

        return new Promise(function(resolve, reject)
        {
            const cmd1 = relay == 0 ? '/s/0/' : '/s/1/';
            const cmd2 = state == true ? '1' : '0';

			// SET /s/X/Y -> API Level: 20200831, 20200229, 20190808
            util.sendGetCommand(cmd1.concat(cmd2),ip)
            .catch(error => {
                console.log(error);
                return reject(error);
            })
            return resolve();
        }); 
    }

    /*
     * switchBoxDToggle - for switchBoxD API type - set one of the relays to on or off (toggle)
     */
    async switchBoxDToggle(ip, relay)
    {

        return new Promise(function(resolve, reject)
        {
            const cmd1 = relay == 0 ? '/s/0/' : '/s/1/';

			// SET /s/X/2 -> API Level: 20200831, 20200229, 20190808
            util.sendGetCommand(cmd1.concat('2'),ip)
            .catch(error => {
                console.log(error);
                return reject(error);
            })
            return resolve();
        }); 
    }


    /*
     *  shutterBoxGetState -> for shutterBox API type - get state of the shutterBox
     */
    async shutterBoxGetState(ip, apiV)
    {
        return new Promise(function(resolve, reject)
        {
            if(apiV == '20190911')
            {
                // GET /api/shutter/state -> API Level: 20190911
                util.sendGetCommand('/api/shutter/state',ip)
                .then(result => {
                    return resolve(result);    
                })
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
            }
        }); 
    }

    /*
     *  shutterBoxGetExtendedState -> for shutterBox API type - get extended state of the shutterBox
     */
        async shutterBoxGetExtendedState(ip, apiV)
        {
            return new Promise(function(resolve, reject)
            {
                if(apiV == '20190911')
                {
                    // GET /api/shutter/extended/state -> API Level: 20190911
                    util.sendGetCommand('/api/shutter/extended/state',ip)
                    .then(result => {
                        return resolve(result);    
                    })
                    .catch(error => {
                        console.log(error);
                        return reject(error);
                    })
                }
            }); 
        }    

    /*
     * shutterBoxSetState - for shutterBox API type - set state to up, down or idle
     */
    async shutterBoxSetState(ip, state)
    {
        return new Promise(function(resolve, reject)
        {
            const cmd = state == 'up' ? '/s/u' : (state == 'down' ? '/s/d' : '/s/s');

			// SET /s/* -> API Level: 20190911
            util.sendGetCommand(cmd,ip)
            .catch(error => {
                console.log(error);
                return reject(error);
            })
            return resolve();
        }); 
    }

    /*
     * shutterBoxSetPosition - for shutterBox API type - set position
     */
    async shutterBoxSetPosition(ip, posValue)
    {
        return new Promise(function(resolve, reject)
        {
            util.sendGetCommand('/s/p/'+posValue,ip)
            .catch(error => {
                console.log(error);
                return reject(error);
            })

            return resolve();
        }); 
    }

    /*
     * shutterBoxSetFavPos - for shutterBox API type - move to favourite position
     */
    async shutterBoxSetFavPos(ip)
    {
        return new Promise(function(resolve, reject)
        {
			// SET /s/* -> API Level: 20190911
            util.sendGetCommand('/s/f',ip)
            .catch(error => {
                console.log(error);
                return reject(error);
            })
            return resolve();
        }); 
    }

    /*
     * shutterBoxSetTilt - for shutterBox API type - set tilt
     */
    async shutterBoxSetTilt(ip, tiltValue)
    {
        return new Promise(function(resolve, reject)
        {
            util.sendGetCommand('/s/t/'+tiltValue,ip)
            .catch(error => {
                console.log(error);
                return reject(error);
            })

            return resolve();
        }); 
    }

    /*
     *  airSensorGetState -> for airSensor API type - get state of the airSensor
     */
        async airSensorGetState(ip, apiV)
        {
            return new Promise(function(resolve, reject)
            {
                if(apiV == '20200831' || apiV == '20200229')
                {
                    // GET /state -> API Level: 20200831 and 20200229
                    util.sendGetCommand('/state',ip)
                    .then(result => {
                        return resolve(result);    
                    })
                    .catch(error => {
                        console.log(error);
                        return reject(error);
                    })
                }
                if(apiV == '20191112')
                {
                    // GET /api/air/state -> API Level: 20191112
                    util.sendGetCommand('/api/air/state',ip)
                    .then(result => {
                        return resolve(result);    
                    })
                    .catch(error => {
                        console.log(error);
                        return reject(error);
                    })
                }
            }); 
        }
    
    /*
     *  gateBoxGetState -> for gateBox API type - get state of the gateBox
     */
    async gateBoxGetState(ip, apiV, username, password)
    {
        return new Promise(function(resolve, reject)
        {
            if(apiV == '20200831' || apiV == '20210118')
            {
                // GET /state -> API Level: 20200831 and 20200229
                util.sendGetCommandAuth('/state',ip, username, password)
                .then(result => {
                    return resolve(result);    
                })
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
            }
            if(apiV == '20151206')
            {
                // GET /api/air/state -> API Level: 20191112
                util.sendGetCommandAuth('/api/gate/state',ip,username,password)
                .then(result => {
                    return resolve(result);    
                })
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
            }
        }); 
    }

    /*
     * gateBoxPrimaryButton - for gateBox API type - primary button
     */
    async gateBoxPrimaryButton(ip, username, password)
    {
        return new Promise(function(resolve, reject)
        {
            util.sendGetCommandAuth('/s/p',ip,username,password)
            .catch(error => {
                console.log(error);
                return reject(error);
            })
            return resolve();
        }); 
    }

    /*
     *  dimmerBoxGetState -> for dimmerBox API type - get state of the dimmerBox
     */
        async dimmerBoxGetState(ip, apiV)
        {
            return new Promise(function(resolve, reject)
            {
                if(apiV == '20170829' || apiV == '20151206')
                {
                    // GET /api/dimmer/state -> API Level: 20170829, 20151206
                    util.sendGetCommandAuth('/api/dimmer/state',ip)
                    .then(result => {
                        return resolve(result);    
                    })
                    .catch(error => {
                        console.log(error);
                        return reject(error);
                    })
                }
            }); 
        }

    /*
     * dimmerBoxSetState - for dimmerBox API type - set dim level
     */
        async dimmerBoxSetState(ip, hexBrightness)
        {
            return new Promise(function(resolve, reject)
            {
                // SET /s/* -
                util.sendGetCommand('/s/'+hexBrightness,ip)
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
                return resolve();
            }); 
        }
    

    /*
     *  wLightBoxGetState -> for wLightBox API type - get state of the wLightBox
     */
    async wLightBoxGetState(ip, apiV)
    {
        return new Promise(function(resolve, reject)
        {
            if(apiV == '20200229' || apiV == '20190808')
            {
                // GET /api/rgbw/state -> API Level: 20200229, 20190808
                util.sendGetCommandAuth('/api/rgbw/state',ip)
                .then(result => {
                    return resolve(result);    
                })
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
            }
        }); 
    }


    /*
     * wLightBoxSetState - for wLightBox API type - set rgbw or s channel levels
     */
    async wLightBoxSetState(ip, channels)
    {
        return new Promise(function(resolve, reject)
        {
            // SET /s/* -
            util.sendGetCommand('/s/'+channels,ip)
            .catch(error => {
                console.log(error);
                return reject(error);
            })
            return resolve();
        }); 
    }

    
    /*
     *  tempSensorGetState -> for tempSensor API type - get state of the tempSensor
     */
    async tempSensorGetState(ip, apiV)
    {
        return new Promise(function(resolve, reject)
        {
            if(apiV == '20220501' || apiV == '20210118' || apiV == '20200610' || apiV == '20200229')
            {
                // GET /state -> API Level: 20220501, 20210118, 20200610, 20200229
                util.sendGetCommand('/state',ip)
                .then(result => {
                    return resolve(result);    
                })
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
            }
        }); 
    }

    /*
     *  saunaBoxState -> for saunaBox API type - get state of the saunaBox
     */
    async saunaBoxGetState(ip, apiV)
    {
        return new Promise(function(resolve, reject)
        {
            if(apiV == '20180604')
            {
                // GET /api/heat/state -> API Level: 20180604
                util.sendGetCommand('/api/heat/state',ip)
                .then(result => {
                    return resolve(result);    
                })
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
            }
        }); 
    }
    

    /*
     *  multiSensorGetState -> for multiSensor API type - get state of the multiSensor
     */
    async multiSensorGetState(ip, apiV)
    {
        return new Promise(function(resolve, reject)
        {
            if(apiV == '20210413' || apiV == '20200831')
            {
                // GET /state -> API Level: 20210413, 20200831
                util.sendGetCommand('/state',ip)
                .then(result => {
                    return resolve(result);    
                })
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
            }
        }); 
    }


    /*
     * thermoBoxSetTargetTemperature - for thermoBox API type - set the target temperature
     */
    async thermoBoxSetTargetTemperature(ip, value)
    {
        return new Promise(function(resolve, reject)
        {
            // SET /s/t/* -
            util.sendGetCommand('/s/t/'+value*100,ip)
            .catch(error => {
                console.log(error);
                return reject(error);
            })
            return resolve();
        }); 
    }


    /*
     * thermoBoxSetState - for thermoBox API type - set the state
     */
    async thermoBoxSetState(ip, value)
    {
        return new Promise(function(resolve, reject)
        {
            // SET /s/* -
            util.sendGetCommand('/s/'+value,ip)
            .catch(error => {
                console.log(error);
                return reject(error);
            })
            return resolve();
        }); 
    }

    /*
     *  thermoBoxGetExtendedState -> for thermoBox API type - get extended state of the thermoBox
     */
    async thermoBoxGetExtendedState(ip, apiV)
    {
        return new Promise(function(resolve, reject)
        {
            if(apiV == '20200229')
            {
                // GET /state -> API Level: 20200229
                util.sendGetCommand('/state/extended',ip)
                .then(result => {
                    return resolve(result);    
                })
                .catch(error => {
                    console.log(error);
                    return reject(error);
                })
            }
        }); 
    }


}
  
  






