"use strict";

var assert = require("assert");
var dep = require("../source/dependency");

suite("dependency", function() {
   test("detect palindromes", function() {
      assert(dep.isPalindrome("mom"));
      assert(!dep.isPalindrome("nope"));
   });
   
   test("capitalize strings", function() {
       assert.equal(dep.capitalize("foo"), "FOO");
   });
});
