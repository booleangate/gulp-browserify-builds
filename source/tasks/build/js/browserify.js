/**
 * Browserify and watchify builds.
 * Options: https://github.com/substack/node-browserify#methods
 */
"use strict";
// 
// var forEach = require("gulp-foreach");
// var gulp = require("gulp");
// var gif = require("gulp-if");
// var mangle = require("gulp-browserify-mangle");
// var rename = require("gulp-rename");
// var uglify = require("gulp-uglify");
// var source = require("vinyl-source-stream");
// var watchify = require("watchify");
// 
// // Browserify build
// exports.browserify = function(options) {
//     
// };
// 
// // Watchify build
// exports.watchify = function(options) {
  
// };

var DEFAULT_CONFIG = {
	// Browserify options from https://github.com/substack/node-browserify#browserifyfiles--opts
	options: {
		// Enables source maps
		debug: true,
		transform: ["brfs"]
	},
	dest: "",
	externals: [],
	sourceMaps: {
		enabled: true,
		rename: function() {
			return rename({suffix: ".min"});
		}
	},
	deflate: true,
	sizeOptions: {
		showFiles: true,
		gzip: true
	},
	verbose: false
}

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
	config.external.forEach(bundler.external.bind(bundler));

	return bundler;
}

/**
 * Build a single application with browserify creating two differnt versions: one normal and one minified.
 * 
 * @param {object} file The file to bundle (a Vinyl file object).
 * @param {browserify|watchify} bundler  The bundler to use.  The "build" task will use browserify, the "autobuild" task will use watchify.
 */
function bundle(file, bundler) {
	// Remove file.base from file.path to create a relative path.  For example, if file looks like
	//   file.base === "/dev/web/super-project/applications/client/apps/"
	//   file.path === "/dev/web/super-project/applications/client/apps/login/reset-password/confirm.js"
	// then result is "login/reset-password/confirm.js"
	var relativeFilename = file.path.replace(file.base, "");
	
	return bundler
		// Log browserify errors
		.on("error", util.log.bind(util, "Browserify Error"))
		// Bundle the application
		.bundle()
		// Rename the bundled file to relativeFilename 
		.pipe(source(relativeFilename))
		// Convert stream to a buffer
		.pipe(buffer())
		// Save the source map for later (uglify will remove it since it is a comment)
		.pipe(sourcemaps.init({loadMaps: true}))
		// Save normal source (useful for debugging)
		.pipe(gulp.dest(APPS_DIST_DIR))
		// Minify source for production
		.pipe(uglify())
		// Restore the sourceMap
		.pipe(sourcemaps.write())
		// Add the .min suffix before the extension
		.pipe(rename({suffix: ".min"}))
		// Log the bundle size
		.pipe(size(SIZE_OPTS))
		// Write the minified file.
		.pipe(gulp.dest(APPS_DIST_DIR));
}


module.exports = function(source, config, isAutomatic) {
    return function() {
        config = utils.configure("test", config, DEFAULT_CONFIG, DEFAULT_PROVIDER_CONFIGS);
        
        var stream = isAutomatic ? watch(source) : gulp.src(source);
        
        
        return test(stream, config);
    };
};
