/*eslint-disable no-unused-vars */

"use strict";

var gulp = require("gulp");
var tasks = require("./");

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
gulp.task("eslint", tasks.qa.lint(SOURCE_ALL, eslintOptions));
gulp.task("autoeslint", tasks.qa.lint(SOURCE_ALL, eslintOptions, true));

gulp.task("jshint", tasks.qa.lint(SOURCE_ALL, jsHintOptions));
gulp.task("autojshint", tasks.qa.lint(SOURCE_ALL, jsHintOptions, true));


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

gulp.task("mochatdd", tasks.qa.test(tddTests, mochaTddOptions));
gulp.task("automochatdd", tasks.qa.test(tddTests, mochaTddOptions, true));

gulp.task("mochabdd", tasks.qa.test(bddTests, mochaBddOptions));
gulp.task("automochabdd", tasks.qa.test(bddTests, mochaBddOptions, true));

gulp.task("jasmine", tasks.qa.test(bddTests, jasmineOptions));
gulp.task("autojasmine", tasks.qa.test(bddTests, jasmineOptions, true));

/*
 * JS Builds
 */
// Concat builds.
var concatJsOptions = {
    filename: "concatedness.js",
    dest: "./",
    verbose: true
};

gulp.task("concatjs", tasks.build.js.concat(SOURCE_APP, concatJsOptions));
gulp.task("autoconcatjs", tasks.build.js.concat(SOURCE_APP, concatJsOptions, true));

// Browserify builds.
var browserifyOptions = {
    dest: "./"
};

gulp.task("browserify", tasks.build.js.browserify(SOURCE_APP, browserifyOptions));
gulp.task("autobrowserify", tasks.build.js.browserify(SOURCE_APP, browserifyOptions, true));
gulp.task("watchify", ["autobrowserify"]);

/*
 * CSS Builds
 */
var concatCssOptions = {
    filename: "concatedness.css",
    dest: "./",
    verbose: true
};

gulp.task("concatcss", tasks.build.css.concat(["test/fixture/css/*.css"], concatCssOptions));
gulp.task("autoconcatcss", tasks.build.css.concat(["test/fixture/css/*.css"], concatCssOptions, true));

gulp.task("default", ["lint"]);
