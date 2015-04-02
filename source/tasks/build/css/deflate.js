"use strict";

var utils = require("../../utils");

var DEFAULT_PROVIDER_CONFIGS = {
	"minify-css": {
        // Options from https://www.npmjs.com/package/gulp-minify-css
        options: {}
	}
};

var DEFAULT_CONFIG = {
    provider: "minify-css",

    // The rest will be merged in from DEFAULT_PROVIDER_CONFIGS for the selected deflator

    // If true (or in automatic mode), output debug info.
    verbose: false
};

var PROVIDERS = {
    "minify-css": function delate(stream, config, isAutomatic) {
        return stream
            .pipe(utils.verboseFileLog("Deflating", config.verbose, isAutomatic))
            .pipe(getDeflator(config));
    }
};

function getDeflator(config) {
    if (config.provider === "minify-css") {
        var minify = require("gulp-minify-css");

        return minify(config.options);
    }

    throw new Error("Unknown CSS deflate provider: '" + config.provider + "'");
}


module.exports = utils.configurableProviderTaskFactory("deflatecss", DEFAULT_CONFIG, DEFAULT_PROVIDER_CONFIGS, PROVIDERS);

module.exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
module.exports.getDeflator = getDeflator;
