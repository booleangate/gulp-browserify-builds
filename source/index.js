"use strict";

var gulp = require("gulp");
var mangle = require("gulp-browserify-mangle");
var forEach = require("gulp-foreach");
var gif = require("gulp-if");
var rename = require("gulp-rename");
var gulp = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
