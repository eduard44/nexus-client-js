"use strict";

var request = require('request'),

    ConfigurationCollection = require('./ConfigurationCollection'),

    NexusClient;

/**
 * Construct a client
 *
 * @param options
 * @constructor
 */
NexusClient = function (options) {
    this.options = {
        server: null,
        apiKey: null
    };

    if (options.hasOwnProperty('server')) {
        this.options.server = options.server;
    }

    if (options.hasOwnProperty('apiKey')) {
        this.options.apiKey = options.apiKey;
    }
};

/**
 * Fetch configuration from the server
 *
 * @param callback
 */
NexusClient.prototype.fetch = function(callback) {
    request.get(this.options.server + '/v1/fetch', {
        headers: {
            'Authorization': 'Bearer ' + this.options.apiKey
        }
    }, function (err, response) {
        if (err) {
            throw err;
        }

        var collection = new ConfigurationCollection(response.body);

        callback(collection);
    });
};

/**
 * Utility function for building a nexus client
 *
 * @param server
 * @param apiKey
 * @returns {NexusClient}
 */
NexusClient.build = function (server, apiKey) {
    return new NexusClient({
        server: server,
        apiKey: apiKey
    });
};

/**
 * Build a client from environment variables
 *
 * @returns {NexusClient}
 */
NexusClient.buildFromEnv = function () {
    if (this.isEnvPresent()) {
        return new NexusClient({
            server: process.env.NEXUS_SERVER,
            apiKey: process.env.NEXUS_APIKEY
        });
    }

    throw new Error('Required environment variables are not present');
};

/**
 * Check if environment variables needed for the nexus client are present
 *
 * @returns {boolean}
 */
NexusClient.isEnvPresent = function () {
    return process.env.hasOwnProperty('NEXUS_SERVER')
    && process.env.hasOwnProperty('NEXUS_APIKEY');
};

module.exports = NexusClient;