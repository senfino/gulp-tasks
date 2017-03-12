module.exports = function(defaults, customOptions){
	let $ = require('jquery');

	return $.extend({}, defaults, customOptions);
};