# TODO - BleBox Homey App

## CRITICAL BUGS (Active breakage)

- [ ] **Fix copy-paste bug: switchBoxT PRO sets wrong relay states**
  - `drivers/switchboxtpro/device.js:32` and `:39` - Relay 2 and 3 are both set to `state1` instead of `state2`/`state3`. Polling always writes relay 1's value to all three relays.

- [ ] **Fix copy-paste bug: switchBoxD DIN sets wrong relay state**
  - `drivers/switchboxddin/device.js:30` - Relay 2 is set to `state1` instead of `state2`.

- [ ] **Fix copy-paste bug: switchBoxT PRO `isRelayOn()` uses wrong capability names**
  - `drivers/switchboxtpro/device.js:117-122` - References `onoff.relaydin1/2/3` but device uses `onoff.relaypro1/2/3`.

- [ ] **Fix undefined class reference: proxiBox won't instantiate**
  - `drivers/proxibox/device.js:7` - `extends BleBoxMDNSDevice` but line 3 imports `BleBoxDevice`. `BleBoxMDNSDevice` is never imported -- this is a runtime ReferenceError.

- [ ] **Fix undefined variable: `driverName` in bleboxdriver_v2.js**
  - `lib/bleboxdriver_v2.js:133` and `:171` - Uses `driverName` instead of `this.driverName`. Causes ReferenceError during pairing errors.

- [ ] **Fix silent error swallowing: `sendPostCommand` catch commented out**
  - `lib/util.js:28` - `return reject(err)` is commented out. All POST failures (webhook registrations for actionBox, floodSensor, rainSensor, proxiBox) resolve silently with `undefined` instead of rejecting.

## HIGH SEVERITY (Incorrect behavior)

- [ ] **Fix `await forEach()` in api.js doesn't actually await**
  - `api.js:6,35,64,86,108` - `forEach()` is not async-aware. `await` on `.forEach()` returns `undefined` immediately. Webhook event handlers fire-and-forget without waiting for completion. Replace with `for...of` loop.

- [ ] **Fix capabilitiesOptions mismatch in switchboxtpro compose**
  - `drivers/switchboxtpro/driver.compose.json:12-29` - Options reference `onoff.relay1/relay2/relay3` but capabilities are `onoff.relaypro1/relaypro2/relaypro3`. Relay titles won't display correctly.

- [ ] **Fix capabilitiesOptions mismatch in switchboxddin compose**
  - `drivers/switchboxddin/driver.compose.json:11-22` - Options reference `onoff.relay1/relay2` but capabilities are `onoff.relaydin1/relaydin2`.

- [ ] **Fix malformed JSON response in api.js**
  - `api.js:28,57,79,101,130` - Returns `"{'code': 200}"` (single quotes = invalid JSON). Also always returns 200 even on failure.

## MEDIUM SEVERITY (Code quality / reliability)

- [ ] **Remove unused imports in app.js**
  - `app.js:5` - `util` imported but never used. `app.js:7` - `BleBoxAPI` imported but never used.

- [ ] **Replace 42 `console.log()` calls with `this.log()`**
  - Primarily in `lib/bleboxapi.js` (41 occurrences) and `lib/bleboxdriver.js:51`. These bypass Homey's logging system.

- [ ] **Add HTTP timeout configuration**
  - `lib/util.js` - All HTTP requests (`sendGetCommand`, `sendPostCommand`, `sendGetCommandAuth`) have no timeout. Unreachable devices will hang until system default.

- [ ] **Replace 135 loose equality operators (`==`/`!=`) with strict equality (`===`/`!==`)**
  - Across 27 files. Particularly risky for comparisons like `== null`, `== ''`, `== 1`.

- [ ] **Fix inconsistent `poll_interval` default when polling disabled**
  - `lib/bleboxdriver_v2.js:118` sets 500ms for mDNS path, but `lib/bleboxdriver_v2.js:156` sets 0ms for IP path.

- [ ] **Remove unused `sharp` dependency**
  - `package.json:17` - `sharp` (native image library) is declared but never imported in any source file.

- [ ] **Add null checks on API response properties in poll methods**
  - Multiple drivers access nested properties like `result.relays[0].state`, `result.shutter.desiredPos.position`, `result.rgbw.desiredColor` without checking if parent objects exist. A malformed API response will crash the poll loop.

- [ ] **Add error handling to flow action listeners in app.js**
  - `app.js:23-57` - None of the 9 `registerRunListener` callbacks have try/catch. If a device method throws, the flow card fails with an unhandled exception.

## LOW SEVERITY (Cleanup / style)

- [ ] **Migrate 11 legacy v1 drivers to v2 architecture**
  - switchbox, switchboxd, switchboxdc, switchboxdin, switchboxddin, switchboxtpro, switchboxv3, switchboxlight, dimmerbox_v2, doorBox_v2, gateboxpro - all still extend `BleBoxDriver` instead of `BleBoxDriver_v2`.

- [ ] **Initialize `previousDimLevel` in wlightboxs**
  - `drivers/wlightboxs/device.js` - Accesses `this.previousDimLevel` in `pollBleBox()` without initializing in `onBleBoxInit()`.

- [ ] **Update outdated dependencies**
  - ESLint v7 (current is v9), `@types/node` v18 (Node 18 EOL).
