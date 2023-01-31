'use strict';

const BleBoxDriver = require('/lib/bleboxdriver.js');

class shutterBoxDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'shutterBox';
    this.bleBoxProduct = 'shutterBox';
    this.bleBoxPoll = 1000;

    const moveToFavoritePosition = this.homey.flow.getActionCard('move_to_favorite_pos');

		moveToFavoritePosition.registerRunListener(async ( args, state ) => {
      await args.device.moveToFavPos();
		});

    this.log('shutterBoxDriver has been initialized');
  }

}

module.exports = shutterBoxDriver;
