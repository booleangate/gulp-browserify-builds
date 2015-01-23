"use strict";

var dep = require("../dependency");
var input = "Satan oscillate my metallic sonatas";

console.log("'" + input + "' " + (dep.isPalindrome(input) ? "is" : "is not") + " a palindrome.");
