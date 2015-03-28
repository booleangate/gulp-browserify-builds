"use strict";

var defaultTestProvider = require("./test").defaultProvider;
var gif = require("gulp-if");
var utils = require("../utils");

var DEFAULT_PROVIDER_CONFIGS = {
	eslint: {
		format: true,
		failOnError: true,

		// ES Lint options
		options: {
			rules: {
				// Removing whitespace is handled by build tasks.
				"no-trailing-spaces": 0,
				// Allow named function definitions to be used before they are defined.
				"no-use-before-define": [1, "nofunc"]
			},
			envs: [defaultTestProvider]
		}
	},

	jshint: {
		reporter: "default",
		// Hopefully these are sensible defaults
		options: {
			unused: true,
			eqnull: true,
			globalstrict: true,
			predef: ["require", "module", "exports", "describe", "it", "suite", "test"]
		}
	}
};

var DEFAULT_CONFIG = {
    provider: "eslint",
    // The rest will be merged in from DEFAULT_PROVIDER_CONFIGS for the selected linter

    // If true (or in automatic mode),    
    verbose: false
};

var PROVIDERS = {
    jshint: function(stream, config, isAutomatic) {
        var jshint = require("gulp-jshint");

        return stream
            .pipe(utils.verboseFileLog("Linting", config.verbose, isAutomatic))
            .pipe(jshint(config.options))
            .pipe(jshint.reporter(config.reporter));
    },
    
    eslint: function(stream, config, isAutomatic) {
        var eslint = require("gulp-eslint");
        
        return stream
            .pipe(utils.verboseFileLog("Linting", config.verbose, isAutomatic))
            .pipe(eslint(config.options))
            .pipe(gif(config.format, eslint.format()))
            .pipe(gif(config.failOnError, eslint.failOnError()));
    }
};

module.exports = utils.configurableProviderTaskFactory("lint", DEFAULT_CONFIG, DEFAULT_PROVIDER_CONFIGS, PROVIDERS);

module.exports.defaultProvider = DEFAULT_CONFIG.provider;
