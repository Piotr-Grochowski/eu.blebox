'use strict';

const BleBoxDriver = require('../../lib/bleboxdriver.js');

class shutterBoxDINDriver extends BleBoxDriver {

  // Overload onInit - to specify which type and product to search in discovery results.
  async onInit()
  {
    this.bleBoxType = 'shutterBox';
    this.bleBoxProduct = 'shutterBox_DIN';
    this.bleBoxPoll = 1000;

    const moveToFavoritePosition = this.homey.flow.getActionCard('shutterboxdin_move_to_favorite_pos');

		moveToFavoritePosition.registerRunListener(async ( args, state ) => {
      await args.device.moveToFavPos();
		});

    this.log('shutterBoxDINDriver has been initialized');
  }

}

module.exports = shutterBoxDINDriver;
