"use strict";

var debug = require("gulp-debug");
var gif = require("gulp-if");
var gulp = require("gulp");
var util = require("util");
var watch = require("gulp-watch");

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

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

function configure(type, config, defaultConfig, providerConfigs) {
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
    if (providerConfigs && !providerConfigs[provider]) {
        throw new Error("Unknown " + type + " provider '" + provider + "'");
    }
    
    // Merge in all default configuration options.
    merge(config, defaultConfig);

    // Merge in all provider specific default configuration options.
    if (providerConfigs) {
       merge(config, providerConfigs[provider]);
    }
    
    return config;
}

function configurableProviderTaskFactory(type, defaultConfig, defaultProviderConfigs, providers) {
    return function(source, config, isAutomatic) {
        return function() {
            config = configure(type, config, defaultConfig, defaultProviderConfigs);
            
            var stream = isAutomatic ? watch(source) : gulp.src(source);
            
            // Execute the selected lint provider.
            return providers[config.provider](stream, config, isAutomatic);
        };
    };
}

function verboseFileLog(title, isVerbose, isAutomatic) {
    return gif(isAutomatic || isVerbose, debug({title: title}));
}

module.exports = {
    clone: clone,
    configure: configure,
    configurableProviderTaskFactory: configurableProviderTaskFactory,
    merge: merge,
    noop: function noop() {},
    verboseFileLog: verboseFileLog
};  
