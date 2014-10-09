"use strict";

var ConfigurationCollection;

/**
 * Build a configuration collection from a json string
 *
 * @param rawJsonString
 * @constructor
 */
ConfigurationCollection = function (rawJsonString)
{
    // Parse the response JSON string
    this.jsonObject = JSON.parse(rawJsonString);

    // Validate the response
    if (!this.jsonObject.hasOwnProperty('status') || this.jsonObject.status !== 'success') {
        throw new Error('Configuration response was not successful');
    }

    if (!this.jsonObject.hasOwnProperty('application') || !this.jsonObject.hasOwnProperty('files')) {
        throw new Error('Configuration response is invalid');
    }
};

/**
 * Get a config file a raw string
 *
 * @param key
 * @returns {*}
 */
ConfigurationCollection.prototype.getKeyAsString = function (key) {
    if (this.hasKey(key)) {
        return this.jsonObject.files[key];
    }

    throw new Error('Configuration key is not available');
};

/**
 * Get a config file as a parsed JSON object
 *
 * @param key
 * @returns {*}
 */
ConfigurationCollection.prototype.getKeyAsJson = function (key) {
    if (this.hasKey(key)) {
        return JSON.parse(this.jsonObject.files[key]);
    }

    throw new Error('Configuration key is not available');
};

/**
 * Check whether a config file is available
 *
 * @param key
 * @returns {boolean}
 */
ConfigurationCollection.prototype.hasKey = function (key) {
    return this.jsonObject.files.hasOwnProperty(key);
};

/**
 * Get the application name
 *
 * @returns {*}
 */
ConfigurationCollection.prototype.getApplicationName = function () {
    return this.jsonObject.application.name;
};

/**
 * Get the application description
 *
 * @returns {*}
 */
ConfigurationCollection.prototype.getApplicationDescription = function () {
    return this.jsonObject.application.description;
};

/**
 * Get all files in the response
 *
 * @returns {*}
 */
ConfigurationCollection.prototype.getAllKeys = function () {
    return this.jsonObject.files;
};

module.exports = ConfigurationCollection;