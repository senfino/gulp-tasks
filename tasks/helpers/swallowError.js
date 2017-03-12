let swallowError = function(error) {
	console.error(error.toString());

	this.emit('end');
};

module.exports = swallowError;