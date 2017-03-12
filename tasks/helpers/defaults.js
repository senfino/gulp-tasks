module.exports = function(defaults, customOptions){
	let _ = require('lodash');

	return _.assign({}, defaults, customOptions);
};