# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Homey app that integrates BleBox.eu home automation devices. The app supports 30+ BleBox device types including switches, dimmers, shutters, sensors, and controllers.

## Common Commands

### Linting
```bash
npm run lint
```

### Building
The project uses Homey's build system. TypeScript/JavaScript files are compiled to `.homeybuild/` directory automatically by the Homey CLI during app installation or testing.

## Architecture Overview

### Driver Architecture

The app uses two driver base classes that devices extend from:

#### Legacy Architecture (v1)
- **BleBoxDriver** (`lib/bleboxdriver.js`): Base driver for older devices using mDNS-SD discovery only
- **BleBoxDevice** (`lib/bleboxdevice.js`): Base device class with optional polling support
- **BleBoxMDNSDevice** (`lib/bleboxmdnsdevice.js`): Device class with built-in mDNS-SD discovery handlers

#### Current Architecture (v2) - Introduced in v3.99.0
- **BleBoxDriver_v2** (`lib/bleboxdriver_v2.js`): Enhanced driver supporting:
  - Multiple device discovery methods (mDNS-SD or manual IP address)
  - Configurable integration methods (polling, webhooks/actions, or both)
  - Custom pairing flow with user preferences
- Device classes still extend BleBoxDevice or BleBoxMDNSDevice

### Driver Implementation Pattern (v2)

Each driver extends `BleBoxDriver_v2` and overrides `onInitAddOn()` to configure:
```javascript
onInitAddOn() {
  this.driverName = 'shutterBoxDriver';
  this.driverType = 'shutterBox';           // API type from BleBox device
  this.driverProduct = ['shutterBox'];       // Allowed product names
  this.drivermDNSSDMethod = true;            // Enable mDNS-SD discovery
  this.driverIPAddressMethod = true;         // Enable manual IP entry
  this.driverActions = false;                // Webhooks/actions support
  this.driverPolling = true;                 // Polling support
  this.driverPollingInterval = 1000;         // Default poll interval (ms)
}
```

### Device Implementation Pattern

Device classes extend one of the base device classes and implement:
- `onBleBoxInit()`: Register capability listeners
- `pollBleBox()`: Fetch device state and update capabilities (if polling enabled)
- Capability handlers: Methods for handling Homey capability changes

Example:
```javascript
async pollBleBox() {
  const result = await this.bbApi.shutterBoxGetState(
    this.getSetting('address'),
    this.getSetting('apiLevel')
  );
  await this.setCapabilityValue('windowcoverings_state', result.state);
}
```

### BleBox API Communication

**BleBoxAPI** (`lib/bleboxapi.js`) provides device-specific methods for HTTP communication:
- Methods follow naming pattern: `{deviceType}GetState`, `{deviceType}SetState`
- Handles multiple API level versions per device (BleBox firmware evolution)
- All communication uses plain HTTP (not HTTPS) to local device IPs
- Uses `http.min` package via utility functions in `lib/util.js`
- Some devices require HTTP Basic Authentication (gateBox, doorBox)

**util.js** provides low-level HTTP helpers:
- `sendGetCommand(endpoint, address)`: Simple GET requests
- `sendGetCommandAuth(endpoint, address, user, pass)`: Authenticated GET
- `sendPostCommand(endpoint, address, data)`: POST for webhook registration

### Webhook/Actions Architecture

Devices that support actions (actionBox, floodSensor, rainSensor, proxiBox) use a webhook system:
- BleBox devices can POST to Homey URLs when events occur
- `api.js` exposes webhook endpoints for each supported device
- During device initialization, devices register webhooks with BleBox hardware via `actionBoxRegisterWebhook()` family of methods
- Webhooks trigger device methods like `onButtonClicked()`, `onFlood()`, etc.

### Device Settings

Key settings stored for each device:
- `address`: IP address of the device
- `apiLevel`: BleBox API version (e.g., '20200831')
- `product`, `hv`, `fv`: Product name, hardware version, firmware version
- `poll_interval`: Polling frequency in milliseconds
- `polling_enabled`: 'Yes'/'No' - whether polling is active
- `webhooks_enabled`: 'Yes'/'No' - whether actions are registered
- `last_poll`: Timestamp of last successful poll (for diagnostics)

### Flow Cards

Global flow cards defined in `app.js`:
- Individual channel control for RGBW devices (dim_white, dim_red, etc.)
- Effect selection for wLightBox devices (`wlightbox_set_effect`)
- Favorite position for shutters (`move_to_favorite_pos`)

Device-specific flow cards defined in `.homeycompose/flow/` and driver-level files.

### mDNS-SD Discovery

Discovery configuration in `.homeycompose/discovery/bbxsrv.json`:
- Searches for `_bbxsrv._tcp` service
- Devices expose type and product information via mDNS-SD
- BleBoxMDNSDevice automatically handles address changes and reconnection

## Key Patterns

### API Level Handling
BleBox devices have evolved through multiple API levels. Most API methods check `apiLevel` parameter and adjust endpoints/parsing accordingly. When adding new device support, check the latest API level in use.

### Polling vs Webhooks
- **Polling**: Device regularly fetches state (suits sensors, lights, shutters)
- **Webhooks**: BleBox device pushes events to Homey (suits buttons, triggers)
- Some devices support both methods simultaneously

### Device Settings Updates
Poll loops update device settings (product, firmware version, API level) which can change after firmware upgrades. Always fetch device state before polling device-specific data.

### Direction Swapping
Shutters support `direction_swap` setting to reverse up/down direction for installation flexibility.

## Device Types Reference

The app currently supports 38 device types in `drivers/` directory. Major categories:
- **Switches**: switchBox variants (standard, DC, DIN, Light, with power meter)
- **Shutters/Gates**: shutterBox, gateBox, gateBoxPro, rollerGate, doorBox
- **Lighting**: dimmerBox, wLightBox variants (RGBW/single color/Pro), pixelBox
- **Sensors**: tempSensor, airSensor, humiditySensor, windSensor, rainSensor, floodSensor
- **Controllers**: thermoBox, saunaBox
- **Triggers**: actionBox, actionBoxS, proxiBox

## Adding New Devices

When adding support for a new BleBox device:

1. Create driver directory in `drivers/`
2. Extend BleBoxDriver_v2 in `driver.js`, configure in `onInitAddOn()`
3. Create device class extending BleBoxDevice or BleBoxMDNSDevice
4. Add API methods to `lib/bleboxapi.js` for the device type
5. Implement `pollBleBox()` and capability handlers
6. Add driver compose files in `.homeycompose/drivers/`
7. If actions are supported, add webhook endpoint in `api.js`
8. Test with both mDNS-SD discovery and manual IP address methods

## Project Structure

```
├── app.js                    # Main app, registers global flow cards
├── api.js                    # Webhook endpoints for action-based devices
├── lib/
│   ├── bleboxapi.js         # Device-specific API methods
│   ├── bleboxdevice.js      # Base device class (v1)
│   ├── bleboxmdnsdevice.js  # mDNS-aware device class (v1)
│   ├── bleboxdriver.js      # Base driver class (v1)
│   ├── bleboxdriver_v2.js   # Enhanced driver class (v2)
│   └── util.js              # HTTP communication utilities
├── drivers/                  # One directory per device type
│   └── {device}/
│       ├── driver.js        # Driver implementation
│       ├── device.js        # Device implementation
│       ├── driver.compose.json
│       ├── assets/          # Device icons
│       └── pair/            # Custom pairing views (v2 drivers)
└── .homeycompose/           # Homey app definition files
    ├── app.json
    ├── capabilities/        # Custom capabilities
    ├── discovery/           # mDNS-SD configuration
    ├── drivers/             # Driver manifests
    └── flow/                # Flow card definitions
```
