# Nexus Client (JS)

Javascript client for the [Nexus Configuration Server](https://github.com/eduard44/nexus)

## Setup

1. Setup a Nexus server
2. Require the library into your project:
```
npm require --save nexus-config-js
```
3. Build a client and fetch configuration files for your app (Explained below)

### Compatibility:
This current version only works with Node.js (server-side) apps.

## Using the client

In order to create an instance of a client with need to provide it with two parameters:

- The address of the server (HTTP or HTTPS)
- The API that is specific to the app you are configuring

These parameters can be passed through environment variables or manually through an options object:

### With environment variables

They client will look for a **NEXUS_SERVER** and **NEXUS_APIKEY** environment variables:

```js
var NexusClient = require('nexus-client-js'),

	clientInstance;
	
clientInstance = NexusClient.buildFromEnv();

clientInstance.fetch(function (collection) {
	// Fetch configuration files here
});
```

Please note that this method will throw an error if the appropriate environment variables are not defined. You can check if they are present with `NexusClient.isEnvPresent()`

### With manual configuration

```js
var NexusClient = require('nexus-client-js'),

	clientInstance;
	
clientInstance = NexusClient.build(
	'http://nexus.local',
	'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
);

clientInstance.fetch(function (collection) {
	// Fetch configuration files here
});
```

## API

### NexusClient
- **fetch(callback)**: Fetches all the configuration files from the server and calls the callback with a ConfigurationCollection object
- **build(server, apiKey)**: Creates a new NexusClient from that uses the specified server and key (NexusClient)
- **buildFromEnv()**: Creates a new NexusClient from evironment variables, NEXUS\_SERVER and NEXUS\_APIKEY (NexusClient)
- **isEnvPresent()**: Returns a boolean indicating if NEXUS\_SERVER and NEXUS\_APIKEY are available (Boolean)

### ConfigurationCollection
- **getKeyAsString(key)**: Get a configuration file as a raw string (String)
- **getKeyAsJson(key)**: Get a configuration file as a JSON object (Object)
- **hasKey(key)**: Check whether or not a file is defined (Boolean)
- **getApplicationName()**: Gets the application name defined in Nexus (String)
- **getApplicationDescription()**: Gets the description of the application defined in Nexus (String)
- **getAllKeys()**: Gets all configuration files as strings (Object)