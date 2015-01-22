"use strict";

var extend = require("extend");
var gif = require("gulp-if");
var gulp = require("gulp");
var watch = require("gulp-watch");

// Default
var DEFAULT_LINTER = "eslint";
var DEFAULT_CONFIGS = {
    eslint: {
        format: true,
        failOnError: true,
        
        // ES Lint options
        options: {
            globals: {
                // TDD mocha functions
                suite: true,
                test: true,
                // BDD mocha functions
                describe: true,
                it: true
            },
            rules: {
                // Removing whitespace is handled by build tasks
                "no-trailing-spaces": 0
            },
            envs: ["node", "browser"]
        }
    },
    
    jshint: {
        reporter: "default",
        options: {}
    }
};

var linters = {
    jshint: function(stream, config) {
        var jshint = require("gulp-jshint");
    
        return stream
            .pipe(jshint(config.options))
            .pipe(jshint.reporter(config.reporter));
    },
    
    eslint: function(stream, config) {
        var eslint = require("gulp-eslint");
        
        return stream
            .pipe(eslint(config.options))
            .pipe(gif(config.format, eslint.format()))
            .pipe(gif(config.failOnError, eslint.failOnError()));
    }
};

function doLint(stream, config) {
    // Make sure config is correct.
    if (!config) {
        config = {};
    }
    
    var linter = config.linter || DEFAULT_LINTER;
    
    // If the specified linter doesn't exist, raise an error.
    if (!DEFAULT_CONFIGS[linter]) {
        throw new Error("Unknown linter, " + linter);
    }
    
    // Ensure that we have the expected keys for the selected linter
    extend(true, config, DEFAULT_CONFIGS[linter]);
    
    // Execute the selected linter.
    return linters[linter](stream, config);
}


module.exports = {
	manual: function(source, config) {
		return doLint(gulp.src(source), config);
	},
	
	watch: function(source, config) {
		return doLint(watch(source), config);
	}
}; 
