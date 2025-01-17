# BleBox

This app adds BleBox.eu support for Homey. 

Blebox.eu is a brand of high-quality products related to home automation. Created in 2013 by authors of the “Polish Invention of the year 2014” and 30 other technological and product innovations. Within 3 years it has evolved from a local start-up to an international company which provides innovative products to more than 20 countries of the world, including China.

# Supported devices

At the moment this app supports the following devices:
- actionBox - physical or virtual multifunctional action trigger
- actionBoxS - 230V mini action trigger
- airSensor - airSensor is your personal air quality sensor - it keeps you informed about the presence of harmful dust suspended in - dimmerBox+ - dimmerBox is the first device in the world which allows you to switch and dim 230V lights in your home or office. Control your lights from a smartphone or tablet, no matter where you are.
- doorBox - an integrated, miniature controller: electric bolt lock, electric strikes and safety devices designed for access control
- floodSensor - detects flood and water leakage
- gateBox - gateBox allows you to not only open and close gates, but also check on their status 
- gateBoxPro - open and close the gate from anywhere in the world
- humiditySensor - humidity and air temperature sensor
- pixelBox - change magically the lighting in your home
- proxiBox - multifuncional proximity action trigger
- rainSensor - detects the start and end of precipitation
- rollerGate - open and close the gate from anywhere in the world
- saunaBox - it is is the world’s first sauna controller that allows you to turn on and off and control the sauna temperature from anywhere in the World without the use of additional peripherals
your home and outside.
- shutterBox - is a device designed to wireless control of electric roller shutters, awnings, screens, etc. (by using Smartphones and tablets), also from any place in the world.
- shutterBoxDC - allows you to control roller blinds, awnings, venetian or windows equipped with low voltage (12-24V) DC motor by using a smartphone or tablet, also from anywhere in the World
- shutterBoxDIN - is a device designed to wireless control of electric roller shutters, awnings, screens, etc. (by using Smartphones and tablets), also from any place in the world, in DIN standard.
- switchBox - this device allows you to wirelessly turn on or off electric devices powered by network voltage of 230V and up to 3kW of power. You can control the load via mobile devices and/or personal computers wherever you are.
- switchBox v3 - you can turn on and off virtually any electrical device using your smartphone and tablet. It doesn’t matter if you are at home, at work or skiing. If you want to turn on the heat before going home, switchBox is the solution for you. And it also has many other possibilities…
- switchBox Light - the smallest controller in the world that allows wireless switching on and off of electrical devices powered by a 230 V mains voltage with a power of up to 1 kW from anywhere in the world
- switchBoxD - switchBoxD - “double” switchBox - can wirelessly turn on or off main voltage electrical devices. It can control two 5A loads (in total 2 kW). Suitable for smaller devices, wherever you want to control two independent electrical circuits with a single controller.
- switchBoxDC - switchBoxDC is a smart switch powered by low voltage (12-24V DC) which allows you to control virtually any electrical device from any place in the world.
- switchBox DIN - on/off or "on time" high power switch for DIN rail
- switchBoxD DIN - double on/off or "on time" switch for DIN rail
- switchBox T PRO - tripple potential-free on/off switch or "turn on time". Schedule, buttons, actions, notifications.
- tempSensor - a device that indicates the temperature, equipped with a waterproof measuring probe, operating in the range of -55 to + 125 degrees Celsius.
- tempSensor PRO - is an accurate temperature sensor with an extended range and increased resistance to weather conditions. It allows you to control the temperature with a smartphone from anywhere in the world.
- tempSensor AC - temperature measurment from -55 to +255 degree, AC powered
- thermoBox - the device designed for the intelligent control of heating or cooling with the possibility of cooperation of 2 digital probes
- wind&RainSensor - wind&rainSensor is a miniature module that allows you to connect external wind and rain sensors to the BleBox system
- windSensor Pro - wind sensor from 0.5 to 30 m/s
- wLightBox - the smallest wireless light controller in the world, wlightbox allows you to control colourful (RGBW) and plain LED lighting. It can be managed not only by smartphones and tablets, but also from your computer.
- wLightBox Pro - turns on and off RGBW LED lighting from anywhere, anytime. Install the controller in the place that best suits your needs, both indoors, outdoors or wherever you want. Use 4 ways to control the device.
- wLightBoxS - Using wLightBoxS you can switch on, off and also adjust brightness of single color LED lights using your smartphone or tablet, also from anywhere in the World. It's an alternative in compare with wLightBox (RGBW LED controller) for people who only want to control one color per device.
- wLightBoxS Pro - turns on, off and dims single-color LED lighting from anywhere, anytime. Install the controller in the place that best suits your needs, both indoors, outdoors or wherever you want. Use 4 ways to control the device.

# Remarks
1. Please set static IP adresses for all your BleBox devices to prevent connectivity issues
2. To work with automatic mDNS-SD device discovery you might have to enable it in your router and/or access points


# Changelog
v.3.99.0
- new "Add device" process. From now on for selected drivers you can select to automatically search for devices using mDNS-SD or to do it manually using user provided IP Address.
- new integration methods for selected drivers - the user can choose to integrate using traditional polling or by using actions or both.
- redesigned polling. Now you can see on selected devices last poll action in settings (to see if connectivity with device works right), soon you will be able to restart polling if failed.
- devices with new adding process: actionBox, actionBoxS, airSensor, dimmerBox, humiditySensor, pixelBox, proxiBox, rainSensor, rollerGate, saunaBox, shutterBox, shutterBoxDC, shutterBoxDIN, tempSensor, tempSensorPro, tempSensorAC,  windSensorPro, wind&RainSensor, wLightBox, wLightBoxV3, wLightBoxPro, wLightBoxS, wLightBoxS
- devices with actions and polling: floodSensor, rainSensor
- devices with actions only: actionBox, actionBoxS, proxiBox
- airSensor with new Homey build-in capabilities
- new unified dimmerBox driver (for v1 & v2), v2 only driver now depreciated - recommended change to unified one
- unified wLightBox* and pixelBox* flow cards (may broke some flows using old flow cards)

v.3.14.7
- tempSensor v2 bugfix

v.3.14.4
- tempsensor v2 support

v.3.14.3
- switchBoxD quickfix for new firmware

v.3.14.2
- rainSensor bugfix

v.3.14.0
- doorBox v2 support

v.3.13.4
- effects support for wLightBoxS
- bugfixes

v.3.13.2
- wind&rainSensor bugfix

v.3.13.1
- Removed depreciated nodeJS methods
- thermoBox separate drivers rejoined into one driver

v.3.13.0
- wind&RainSensor support added

v.3.12.1
- thermoBox modification

v.3.12
- floodSensor support added
- proxiBox support added

v.3.11.3
- saunaBox bugfix

v.3.11.2
- discovery bugfix

v.3.11.1
- Heat Index icon added
- actionBox and actionBoxS bugfix

v.3.11.0
- wLightBox bugfix
- wLightBox v3 support added
- thermoBox power usage approximation added

v.3.10.0
- actionBox and actionBoxS support added
- gateBox and gateBoxPro device class changed

v.3.9.2
- two thermoBox drivers - for room thermostat and high temperature (e.g. water tank) scenarios

v.3.9.1
- pixelBox bugfix
- thermoBox bugfix

v.3.9.0
- wLightBox & wLightBox PRO effects support added
- shutterBox DIN support added
- pixelBox support added
- windSensor PRO support added
- humiditySensor support added
- added new Trigger Flow Cards for some devices
- thermoBox rewrite to support more scenarios and higher temperatures

v.3.8.0
- new device icons
- switchBox DIN support added
- switchBoxD DIN support added
- switchBoxT PRO support added

v.3.7.1
- minor fixes

v.3.7.0
- dimmerBox V2 support added
- gateBox 2022**** and 20230102 API Levels support added
- rollerGate support added

v.3.6.1
- Polling optimization

v.3.6.0
- gateBoxPro support

v.3.5.7
- HomeyPro 2023 bugfixes

v.3.5.4
- tempSensor bugfix

v.3.5.3
- Bugfix for tempSensorAC v2

v.3.5.1
- BleBox API error logging bugfix

v.3.5.0
- added FlowCards for switchBoxD relays
- added additional shutterBox, shutterBoxDC and wLightBox FlowCards 

v.3.4.6
- shutterBoxDC bugfix

v.3.4.0
- shutterBoxDC support added

v.3.3.0
- shutterBox posiotion set bugfix
- tempSensor AC support added
- wLightBox Pro support added
- wLightBoxS Pro support added
- switchBox Light support added
- switchBox v3 (with power meter) support added
- removed unused power meter capabilities from older (v1) switchBox and switchBoxDC drivers

v.3.2.0
- saunaBox support added

v.3.1.3
- Wisniowski/RiCo branded gateBox support patched

v.3.1.2
- another tempSensor bugfix

v.3.1.1
- tempSensor bugfix

v.3.1.0
- rainSensor support added
- thermoBox support added
- bugfixes

v.3.0.1
- total rewrite of the code for Homey SDK V3
- automatic mDNS-SD discovery of the supported devices (all but dimmerBox and doorBox)
- support for power meter in switchBox
- tempSensor PRO support
- BREAKING CHANGES: due to fundamental changes in the app, recreation of all devices is REQUIRED!


v.2.4.1
- bugfix for dimmerBox v2

v.2.4.0
- switchBox driver bugfix (double poll problem)
- added information fields to dimmerBox settings page (hardware and firmware versions, product name)
- added new flow triggers for dimmerBox device (fires when the device is turned on/off outside of homey - e.g. with a wall switch)

v.2.3.0
- switchBox driver updated to latest API level (20200229). You might need to update your device to latest firmware.
- added information fields to switchBox settings page (hardware and firmware versions, API level, product name)
- added new flow triggers for switchBox device (fires when the device is turned on/off outside of homey - e.g. with a wall switch)

v.2.2.0
- gateBox and doorBox user authentication added

v.2.1.8
- shutterBox Tilt detection

v.2.1.7
- shutterBox flow bugfix

v.2.1.6
- shutterBox move to favorite position flow action added

v.2.1.5
- added new shutterBox functionalities

v.2.1.2
- another shutterBox bugfixes

v.2.1.1
- shutterBox bugfix

v.2.1.0
- doorBox support added
- gateBox pooling bug fixed

v.2.0.0
- total code rewrite for better memory allocation

v.1.8.4
- memory optimisations

v.1.8.3
- minor bugfixes

v.1.8.2
- small bugfixes
- changes for the new AppStore

v.1.8.1
- gateBox driver bugfixes

v.1.8.0
- added gateBox support

v.1.7.0
- added Homey Energy support
- shutterBox bugfixes

v.1.6.0
- shutterBox support added

v.1.5.0
- tempSensor support added

v.1.4.0
- wLightBoxS support added
- bugfix for switchBoxDC pairing

v.1.3.0
First public release
- switchBox support
- switchBoxDC support
- switchBoxD support
- dimmerBox support
- wLightBox support
- airSensor support
