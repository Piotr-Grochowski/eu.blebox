const Homey = require('homey');
const BleBoxAPI = require('/lib/bleboxapi.js')


module.exports = class shutterBoxDCDriver extends Homey.Driver {
	
	async onInit() {

		const moveToFavoritePosition = this.homey.flow.getActionCard('move_to_favorite_pos_dc');

		moveToFavoritePosition.registerRunListener(async ( args, state ) => {
	    	await args.device.moveToFavPos();
		});


		this.log('shutterBoxDCDriver has been initialized');
	}
	
	async onPair( session ) {
		// called when a user presses Connect on the UI
		session.setHandler('addBleBox', async function( data, callback ) {
            return new Promise(function(resolve, reject)
			{
				// Check if this is a real switchBox
				const bbApi = new BleBoxAPI();

				bbApi.getDeviceState(data.ip)
				.then(result => {
					if(result.type=='shutterBox')
					{
						// Retrieve device data
						var device_data = {
							id: result.id,
							name: result.deviceName,
							address : data.ip,
							poll_interval: 1000,
							product: 'n/a',
							apiLevel: result.apiLevel,
							hv: result.hv,
							fv: result.fv
						};
						// and pass it back to UI
						resolve(device_data);		
					}
					else
					{
						// if the device is of wrong type
						reject(new Error("Wrong device type: "+result.type));
					}
				})
				.catch(error => {
					// if an error occured
					reject(error);
				})
			});
		});
	  }
}