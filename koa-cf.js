module.exports = function() {
	return function* (next) {
		var cfip = this.headers["cf-connecting-ip"];
		if (cfip)
			this.request.ip = cfip;

		yield next;
	};
};
