# Nexus Client (JS)

Javascript client for the Nexus Configuration Server

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
- fetch(callback)
- build(server, apiKey)
- buildFromEnv()
- isEnvPresent()

### ConfigurationCollection
- getKeyAsString(key)
- getKeyAsJson(key)
- hasKey(key)
- getApplicationName()
- getApplicationDescription()
- getAllKeys()