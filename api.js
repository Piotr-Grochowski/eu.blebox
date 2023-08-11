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
    }
};
