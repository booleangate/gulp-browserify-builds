/*eslint-disable no-unused-vars */

"use strict";

var gulp = require("gulp");
var taskLib = require("./");

var SOURCE_APP = ["source/**/*.js"];
var SOURCE_ALL = SOURCE_APP.concat(["test/**/*.js", "gulpfile.js"]);


/**
 * Linting
 */
var eslintOptions = {
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
gulp.task("eslint", taskLib.qa.lint(SOURCE_ALL, eslintOptions));
gulp.task("autoeslint", taskLib.qa.lint(SOURCE_ALL, eslintOptions, true));

gulp.task("jshint", taskLib.qa.lint(SOURCE_ALL, jsHintOptions));
gulp.task("autojshint", taskLib.qa.lint(SOURCE_ALL, jsHintOptions, true));



/**
 * Testing
 */
var mochaTddOptions = {
    provider: "mocha",
    options: {
        ui: "tdd"
    }
};
var mochaBddOptions = {
    provider: "mocha",
    options: {
        ui: "bdd"
    }
};

var jasmineOptions = {
    provider: "jasmine"
};

var tddTests = ["test/**/*-tdd.js"];
var bddTests = ["test/**/*-bdd.js"];

gulp.task("test", ["mochatdd"]);
gulp.task("autotest", ["automochatdd"]);

gulp.task("mochatdd", taskLib.qa.test(tddTests, mochaTddOptions));
gulp.task("automochatdd", taskLib.qa.test(tddTests, mochaTddOptions, true));

gulp.task("mochabdd", taskLib.qa.test(bddTests, mochaBddOptions));
gulp.task("automochabdd", taskLib.qa.test(bddTests, mochaBddOptions, true));

gulp.task("jasmine", taskLib.qa.test(bddTests, jasmineOptions));
gulp.task("autojasmine", taskLib.qa.test(bddTests, jasmineOptions, true));


gulp.task("default", ["lint"]);
