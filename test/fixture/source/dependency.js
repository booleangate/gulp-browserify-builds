"use strict";

module.exports = {
	capitalize: function(s) {
		return s.toUpperCase();
	},

	isPalindrome: function(str) {
	    // From http://stackoverflow.com/a/22111572/126562
		var len = str.length;
		
		for (var i = 0; i < Math.floor(len / 2); i++ ) {
			if (str[i] !== str[len - 1 - i] ) {
				return false;
			}
		}
		
		return true;
	}
};
