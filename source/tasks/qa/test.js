"use strict";

var gulp = require("gulp");
var istanbul = require("gulp-istanbul");
var utils = require("../utils");
var watch = require("gulp-watch");

// Add these providers:
//   https://www.npmjs.com/package/tape

// Provide a consistent default timeout across providers
var DEFAULT_TIMEOUT = 5000; 

var DEFAULT_PROVIDER_CONFIGS = {
    jasmine: {
        // See https://www.npmjs.com/package/gulp-jasmine
        options: {
            timeout: DEFAULT_TIMEOUT
        }
    },
    
    mocha: {
        // See https://www.npmjs.com/package/gulp-mocha
        options: {
            ui: "bdd",
            timeout: DEFAULT_TIMEOUT
        }
    }
};

var DEFAULT_CONFIG = {
    provider: "mocha",
    // Provider specific config will be merged in from DEFAULT_PROVIDER_CONFIGS.,
    
    verbose: false,
    
    coverage: {
        enable: false,
        options: {
            // Default options.  See https://github.com/SBoudrias/gulp-istanbul#istanbulopt
            constructor: {},
            // Default options.  See https://github.com/SBoudrias/gulp-istanbul#istanbulwritereportsopt
            writeReports: {}
        }
    }
};

var PROVIDERS = {
    jasmine: require("gulp-jasmine"),
    mocha: require("gulp-mocha")
};

function test(stream, config) {
    var tester = PROVIDERS[config.provider];

    return stream.pipe(tester(config.options));
}

function testCoverage(stream, config, source, onComplete) {
    var options = config.coverage.options;
    
    // Instrument all source files with Istanbul before running tests.
    return stream
        .pipe(istanbul(options.constructor))
        .pipe(istanbul.hookRequire())
        // Once instrumentation is done, run the tests and generate the coverage report
        .on("finish", function () {
            test(gulp.src(source), config)
                .pipe(istanbul.writeReports(options.writeReports))
                .on("end", onComplete);
        });
}

module.exports = function(source, config, isAutomatic) {
    return function() {
        config = utils.configure("test", config, DEFAULT_CONFIG, DEFAULT_PROVIDER_CONFIGS);
        
        var stream = isAutomatic ? watch(source) : gulp.src(source);
        
        if (config.coverage.enable) {
            return function(onComplete) {
                testCoverage(stream, config, source, onComplete);
            };
        }
        
        return test(stream, config);
    };
};

module.exports.defaultProvider = DEFAULT_CONFIG.provider;
