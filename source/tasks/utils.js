"use strict";

var debug = require("gulp-debug");
var gif = require("gulp-if");
var util = require("util");

function merge(dest, src) {
    Object.keys(src).forEach(function(key) {
        if (typeof dest[key] === "undefined") {
            dest[key] = src[key];
        }
        else if (!util.isArray(typeof dest[key]) && typeof dest[key] === "object") {
            merge(dest[key], src[key]);
        }
    });
}

exports.configure = function setProviderConfig(type, config, defaultConfig, providerConfigs) {
    // No config? Use empty object.
    if (!config) {
        config = {};
    }
    
    // No provider set? Use the default provider.
    if (!config.provider) {
        config.provider = defaultConfig.provider; 
    }
    
    var provider = config.provider;
    
    // Invalid provider? Error out.
    if (!providerConfigs[provider]) {
        throw new Error("Unknown " + type + " provider '" + provider + "'");
    }
    
    // Merge in all default configuration options.
    merge(config, defaultConfig);
    // Merge in all provider specific default configuration options.
    merge(config, providerConfigs[provider]);
    
    return config;
};

exports.verboseFileLog = function(title, isVerbose, isAutomatic) {
    return gif(isAutomatic || isVerbose, debug({title: title}));
};
