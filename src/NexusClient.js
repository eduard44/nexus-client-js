"use strict";

var request = require('request'),

    ensure = require('ensure.js'),
    os = require("os"),

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

    // Fetch hostname
    this.hostname = 'UNKNOWN';

    if (os && os.hostname) {
        this.hostname = os.hostname();
    }

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

        if (callback) {
            callback(collection);
        }
    });
};

/**
 * Push logs to the server
 *
 * @param filename {String}
 * @param lines {String|String[]}
 * @param callback {Function}
 */
NexusClient.prototype.log = function (filename, lines, callback) {
    var hostname = this.hostname;

    // Convert string into array
    if (ensure(lines, String, true)) {
        lines = lines.split("\n");
    }

    request.post(this.options.server + '/v1/logs', {
        headers: {
            'Authorization': 'Bearer ' + this.options.apiKey
        },
        json: true,
        body: {
            instanceName: hostname,
            filename: filename,
            lines: lines
        }
    }, function (err, response) {
        if (err) {
            throw err;
        }

        if (response.body.status !== 'success') {
            throw new Error('Invalid server response: ' + JSON.stringify(response.body));
        }

        if (callback) {
            callback();
        }
    });
};

/**
 * Ping the server (with optional message)
 *
 * @param [message] {String}
 * @param callback {Function}
 */
NexusClient.prototype.ping = function (message, callback) {
    var hostname = this.hostname;

    message = ensure.one(message, 'Ping');

    request.post(this.options.server + '/v1/ping', {
        headers: {
            'Authorization': 'Bearer ' + this.options.apiKey
        },
        json: true,
        body: {
            name: hostname,
            message: message
        }
    }, function (err, response) {
        if (err) {
            throw err;
        }

        if (response.body.status !== 'success') {
            throw new Error('Invalid server response: ' + JSON.stringify(response.body));
        }

        if (callback) {
            callback();
        }
    });
};

/**
 * Override the hostname sent to the server
 *
 * @param newHostname
 */
NexusClient.prototype.overrideHostname = function (newHostname) {
    ensure(newHostname, String);

    this.hostname = newHostname;
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