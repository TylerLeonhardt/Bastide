var log = require('./log');

module.exports = function() {
	return function* (next) {
		log((this.request.cfip || this.request.ip) + " requests " + this.request.path);
		yield next;
	};
};

