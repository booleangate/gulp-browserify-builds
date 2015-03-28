"use strict";

var utils = require("../../utils");

var DEFAULT_PROVIDER_CONFIGS = {
	uglify: {
        // Options from https://www.npmjs.com/package/gulp-uglify
        options: {
            preserveComments: "some"
        }
	}
};

var DEFAULT_CONFIG = {
    provider: "uglify",

    // The rest will be merged in from DEFAULT_PROVIDER_CONFIGS for the selected deflator

    // If true (or in automatic mode), output debug info.
    verbose: false
};

var PROVIDERS = {
    uglify: deflate
};

function deflate(stream, config, isAutomatic) {
    return stream
        .pipe(utils.verboseFileLog("Uglifying", config.verbose, isAutomatic))
        .pipe(getDeflator(config));
}

function getDeflator(config) {
    if (config.provider === "uglify") {
        var uglify = require("gulp-uglify");

        return uglify(config.options);
    }

    throw "Unknown deflate provider, '" + config.provider + "'.";
}


module.exports = utils.configurableProviderTaskFactory("deflatejs", DEFAULT_CONFIG, DEFAULT_PROVIDER_CONFIGS, PROVIDERS);

module.exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
module.exports.getDeflator = getDeflator;
