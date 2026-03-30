function handleSwitchBoxWebhook(homey, query, driverId) {
  const driver = homey.drivers.getDriver(driverId);
  driver.getDevices().forEach(element => {
    if(element.getData().id == query.device)
    {
      switch(query.action)
      {
        case 'click': element.onButtonClicked(query.input);
                    break;
        case 'clickLong': element.onButtonClickedLong(query.input);
                    break;
        case 'fallingEdge': element.onButtonFallingEdge(query.input);
                    break;
        case 'risingEdge': element.onButtonRisingEdge(query.input);
                    break;
        case 'anyEdge': element.onButtonAnyEdge(query.input);
                    break;
      }
    }
  });
  return "{'code': 200}";
}

module.exports = {
    async actionBox({ homey, query }) {
      // you can access query parameters like "/?foo=bar" through `query.foo`

      const driver = await homey.drivers.getDriver('actionbox');
      await driver.getDevices().forEach(element => {
        if(element.getData().id == query.device) 
        {   
            switch(query.action)
            {
                case 'click': element.onButtonClicked(query.input);
                            break;
                case 'clickLong': element.onButtonClickedLong(query.input);
                            break;
                case 'fallingEdge': element.onButtonFallingEdge(query.input);
                            break;
                case 'risingEdge': element.onButtonRisingEdge(query.input);
                            break;
                case 'anyEdge': element.onButtonAnyEdge(query.input);
                            break;
            }
            
        }
      });
        
      // perform other logic like mapping result data
  
      return "{'code': 200}";
    },

    async actionBoxS({ homey, query }) {
      // you can access query parameters like "/?foo=bar" through `query.foo`

      const driver = await homey.drivers.getDriver('actionboxs');
      await driver.getDevices().forEach(element => {
        if(element.getData().id == query.device) 
        {   
            switch(query.action)
            {
                case 'click': element.onButtonClicked();
                            break;
                case 'clickLong': element.onButtonClickedLong();
                            break;
                case 'fallingEdge': element.onButtonFallingEdge();
                            break;
                case 'risingEdge': element.onButtonRisingEdge();
                            break;
                case 'anyEdge': element.onButtonAnyEdge();
                            break;
            }
            
        }
      });
        
      // perform other logic like mapping result data
  
      return "{'code': 200}";
    },

    async floodSensor({ homey, query }) {
      // you can access query parameters like "/?foo=bar" through `query.foo`

      const driver = await homey.drivers.getDriver('floodsensor');
      await driver.getDevices().forEach(element => {
        if(element.getData().id == query.device) 
        {   
            switch(query.action)
            {
                case 'flood': element.onFlood();
                            break;
                case 'noflood': element.onNoFlood();
                            break;
            }            
        }
      });
        
      // perform other logic like mapping result data
  
      return "{'code': 200}";
    },

    async rainSensor({ homey, query }) {
      // you can access query parameters like "/?foo=bar" through `query.foo`

      const driver = await homey.drivers.getDriver('rainsensor');
      await driver.getDevices().forEach(element => {
        if(element.getData().id == query.device) 
        {   
            switch(query.action)
            {
                case 'rain': element.onRain();
                            break;
                case 'norain': element.onNoRain();
                            break;
            }            
        }
      });
        
      // perform other logic like mapping result data
  
      return "{'code': 200}";
    },

    async switchBox({ homey, query }) {
      return handleSwitchBoxWebhook(homey, query, 'switchbox');
    },

    async switchBoxD({ homey, query }) {
      return handleSwitchBoxWebhook(homey, query, 'switchboxd');
    },

    async switchBoxDC({ homey, query }) {
      return handleSwitchBoxWebhook(homey, query, 'switchboxdc');
    },

    async switchBoxDDIN({ homey, query }) {
      return handleSwitchBoxWebhook(homey, query, 'switchboxddin');
    },

    async switchBoxDIN({ homey, query }) {
      return handleSwitchBoxWebhook(homey, query, 'switchboxdin');
    },

    async switchBoxLight({ homey, query }) {
      return handleSwitchBoxWebhook(homey, query, 'switchboxlight');
    },

    async switchBoxTPRO({ homey, query }) {
      return handleSwitchBoxWebhook(homey, query, 'switchboxtpro');
    },

    async switchBoxV3({ homey, query }) {
      return handleSwitchBoxWebhook(homey, query, 'switchboxv3');
    },

    async switchBoxSeparated({ homey, query }) {
      return handleSwitchBoxWebhook(homey, query, 'switchboxseparated');
    },

    async proxiBox({ homey, query }) {
      // you can access query parameters like "/?foo=bar" through `query.foo`

      const driver = await homey.drivers.getDriver('proxibox');
      await driver.getDevices().forEach(element => {
        if(element.getData().id == query.device) 
        {   
            switch(query.action)
            {
                case 'click': element.onButtonClicked();
                            break;
                case 'clickLong': element.onButtonClickedLong();
                            break;
                case 'fallingEdge': element.onButtonFallingEdge();
                            break;
                case 'risingEdge': element.onButtonRisingEdge();
                            break;
                case 'anyEdge': element.onButtonAnyEdge();
                            break;
            }
            
        }
      });
        
      // perform other logic like mapping result data
  
      return "{'code': 200}";
    }
};
