module.exports = function() {
	return function* (next) {
		this.request.cfip = this.headers["cf-connecting-ip"] || this.request.ip;
		yield next;
	};
};
