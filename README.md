[![npm](https://badgen.net/npm/v/homebridge-opnsense/latest)](https://www.npmjs.com/package/homebridge-opnsense)
[![npm](https://badgen.net/npm/dt/homebridge-opnsense)](https://www.npmjs.com/package/homebridge-opnsense)

![NPM Package Downloads](https://badgen.net/npm/dm/homebridge-opnsense)

# Homebridge OpnSense
[Homebridge OpnSense](https://www.npmjs.com/package/homebridge-opnsense) is a plugin for [Homebridge](https://github.com/homebridge/homebridge) allowing toggle OpnSense firewall rules from Homekit

## Installation
Follow the instructions in [homebridge](https://www.npmjs.com/package/homebridge) for the homebridge server installation.
This plugin is published through [NPM](https://www.npmjs.com/package/homebridge-opnsense) and should be installed "globally" by typing:

    npm install -g homebridge-opnsense

Installation through
[Homebridge Config UI X](https://www.npmjs.com/package/homebridge-config-ui-x) is also supported (and recommended).

## Configuration

### OpnSense
- install the os-firewall plugin on your OpnSense firewall (under `System > Firmware > Plugins`)
- create a user with the "Firewall: Rules: API" privileges (under `System > Access > Users`). *Note* unfortunately, I'm not 
aware of any more restrictive rights - but it would be nice to have a set of rights that only allow to toggle rules, not 
to create any.
- and generate an API key / secret for this user - this will enable the plugin to toggle the firewall rules
- create one or more firewall rules in the firewall automation sections (under `Firewall > Automation > Filters`). *Note* 
this won't work with "regular" firewall rules, they have to be configured in the Automation section
- write down the UUID of the rules you want to control through homebridge (you can find the UUIDs of your rules by calling 
the API from your browser after logging into the OpnSense UI at `/api/firewall/filter/get`)

Before proceeding with the Homebridge configuration, it's good to try your rules by enabling them manually and verifying 
they're doing what you except them to do.

### Homebridge
Configure the plugin in your homebridge `config.json` file. Or using the settings page of the plugin

A typical configuration will look like this:

    {
      "host": "<Host name of your OpnSense firewall>",
      "apiKey": "<API key for the user you configured>",
      "apiSecret": "<API secret for the user you configured>",
      "allowInvalidCert": <true/false - depends if you have a valid certificate for your opnsense web server>,
      "fwRules": [
        {
          "name": "rule 1",
          "uuid": "<uuid associated with rule 1>"
        },
        {
          "name": "rule 2",
          "uuid": "<uuid associated with rule 2>"
        },
        (...)
      ],
      "platform": "OpnSense"
    }
