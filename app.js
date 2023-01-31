'use strict';

const Homey = require('homey');

const util = require('/lib/util.js');

const BleBoxAPI = require('/lib/bleboxapi.js')

class BleBoxApp extends Homey.App {

	async onInit() {
		this.log('BleBox App is running...');
	}

}

module.exports = BleBoxApp;
