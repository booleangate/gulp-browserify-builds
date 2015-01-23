/*eslint-disable no-unused-vars */

"use strict";

var gulp = require("gulp");
var taskLib = require("./");

var SOURCE_ALL = ["source/**/*.js", "gulpfile.js"];


/**
 * Linting
 */
var esLintOptions = {
    provider: "eslint",
    options: {
        envs: ["mocha", "node"]
    }
};

var jsHintOptions = {
    provider: "jshint"
};

gulp.task("lint", ["eslint"]);
gulp.task("autolint", ["autoeslint"]);

gulp.task("eslint", taskLib.qa.lint(SOURCE_ALL, esLintOptions));
gulp.task("autoeslint", taskLib.qa.lint(SOURCE_ALL, esLintOptions, true));

gulp.task("jshint", taskLib.qa.lint(SOURCE_ALL, jsHintOptions));
gulp.task("autojshint", taskLib.qa.lint(SOURCE_ALL, jsHintOptions, true));

gulp.task("default", ["lint"]);
