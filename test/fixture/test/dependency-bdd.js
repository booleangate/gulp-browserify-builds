"use strict";

var assert = require("assert");
var dep = require("../source/dependency");

describe("dependency", function() {
   it("should detect palindromes", function() {
      assert(dep.isPalindrome("mom"));
      assert(!dep.isPalindrome("nope"));
   });
   
   it("should capitalize strings", function() {
       assert.equal(dep.capitalize("foo"), "FOO");
   });
});
