"use strict";

// Options from https://www.npmjs.com/package/gulp-minify-css
// keepSpecialComments: 0

var concat = require("gulp-concat");
var gif = require("gulp-if");
var gulp = require("gulp");
var size = require("gulp-size");
var utils = require("../utils");
var watch = require("gulp-watch");

var DEFAULT_CONFIG = {
	filename: "", // The built filename.
	dest: "", // The destination path.
	deflator: {}, // The deflator
	sizeOptions: {
		showFiles: true,
		gzip: true
	},

	// Always true in automatic mode
	verbose: false
};

function configureDeflator(deflatorConfig, deflateModule) {
	if (deflatorConfig === false) {
		return false;
	}

	if (typeof deflatorConfig === "function") {
		return deflatorConfig;
	}

	var config = utils.clone(deflatorConfig);

	// Merge default config with provided deflatorConfig
	utils.merge(config, deflateModule.DEFAULT_CONFIG);

	return deflateModule.getDeflator(config);
}

module.exports = function(type, deflateModule) {
	return function(source, config, isAutomatic) {
		config = utils.configure("concat " + type, config, DEFAULT_CONFIG);
		
		if (!config.dest) {
			throw "concat" + type + ": must specifiy no destination.";
		}

		if (!config.filename) {
			throw "concat" + type + ": must specifiy no filename.";
		}

		config.deflator = configureDeflator(config.deflator, deflateModule);
		
		// Execute the selected lint provider.
		return function() {
			var stream = isAutomatic ? watch(source) : gulp.src(source);

			return stream
				.pipe(gif(config.verbose, size(config.sizeOptions)))
				.pipe(concat(config.filename))
				.pipe(gif(config.verbose, size(config.sizeOptions)))
				.pipe(gif(config.deflator, config.deflator || utils.noop))
				.pipe(gif(config.deflator && config.verbose, size(config.sizeOptions)))
				.pipe(gulp.dest(config.dest));
		};
	};
};
