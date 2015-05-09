/**
 * Browserify and watchify builds.
 * Options: https://github.com/substack/node-browserify#methods
 */
"use strict";
 
var forEach = require("gulp-foreach");
var browserify = require("browserify");
var buffer = require("vinyl-buffer");
var gulp = require("gulp");
var gif = require("gulp-if");
var mangle = require("gulp-browserify-mangle");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var size = require("gulp-size");
var toStream = require("vinyl-source-stream");
var sourcemaps = require("gulp-sourcemaps");
var utils = require("../../utils");
var watch = require("gulp-watch");
var watchify = require("watchify");


var DEFAULT_CONFIG = {
	// Browserify options from https://github.com/substack/node-browserify#browserifyfiles--opts
	options: {
		// Enables source maps
		debug: true,
		transform: ["brfs"]
	},
	// The directory to save bundles in.
	dest: "",
	externalModules: [],
	sourceMaps: {
		options: {
			loadMaps: true
		}
	},
	deflator: {/* TODO */},
	rename: rename({suffix: ".min"}),
	deflateModuleNames: true,
	sizeOptions: {
		showFiles: true,
		gzip: true
	},
	verbose: false
};

/**
 * Get a properly configured bundler for manual (browserify) and automatic (watchify) builds.
 * 
 * @param {object} file The file to bundle (a Vinyl file object).
 * @param {object|null} options Options passed to browserify.
 */
function getBundler(file, config) {	
	// Initialize browserify with the file and options provided.
	var bundler = browserify(file.path, config.options);
	
	// Exclude externalized libs (those from build-common-lib).
	if (config.externalModules) {
		config.externalModules.forEach(bundler.external.bind(bundler));
	}

	return bundler;
}

/**
 * Build a single application with browserify creating two differnt versions: one normal and one minified.
 * 
 * @param {object} file The file to bundle (a Vinyl file object).
 * @param {browserify|watchify} bundler  The bundler to use.  The "build" task will use browserify, the "autobuild" task will use watchify.
 */
function bundle(file, bundler, config) {
	// Remove file.base from file.path to create a relative path.  For example, if file looks like
	//   file.base === "/dev/web/super-project/applications/client/apps/"
	//   file.path === "/dev/web/super-project/applications/client/apps/login/reset-password/confirm.js"
	// then result is "login/reset-password/confirm.js"
	var relativeFilename = file.path.replace(file.base, "");
	var stream = bundler
		// Bundle the application
		.bundle()
		// Rename the bundled file to relativeFilename 
		.pipe(toStream(relativeFilename))
		// Convert stream to a buffer
		.pipe(buffer())
		// Deflate (mangle) module names
		.pipe(gif(config.deflateModuleNames, mangle()));

	// Initialize source maps.
	if (config.options.debug) {
		// Save the source map for later (uglify will remove it since it is a comment)
		stream = stream.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(gulp.dest(config.dest));
	}

	// Deflate
	if (config.deflator) {
		stream = stream.pipe(config.deflator);
	}

	// Finalize source maps.
	if (config.options.debug) {
		// Restore the sourceMap
		stream = stream.pipe(sourcemaps.write());
	}

	// Add the .min suffix before the extension
	return stream.pipe(gif(config.rename, config.rename()))
		// Log the bundle size
		.pipe(size(config.sizeOptions))
		// Write the minified file.
		.pipe(gulp.dest(config.dest));
}


module.exports = function(source, config, isAutomatic) {
    return function() {
        config = utils.configure("test", config, DEFAULT_CONFIG, DEFAULT_PROVIDER_CONFIGS);
        
        var stream = isAutomatic ? watch(source) : gulp.src(source);
        
        
        return test(stream, config);
    };
};

module.exports.bundle = bundle;
