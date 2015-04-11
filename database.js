var mysql = require('mysql');
var config = require('./config/db.json');

var connection;
function setup() {
	connection = mysql.createConnection(config);
	connection.connect();
	connection.on('error', function(err) {
		console.log(err);
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			setup();
		}
	});
}

module.exports.query = function(query) {
	var f = function(callback) {
		try {
			connection.query(query, callback);
		} catch (e) {
			console.log(e);
			setup();
			setTimeout(function() { f(callback); }, 100);
		}
	};
	return f;
}

module.exports.escape = function(str) {
	return connection.escape(str);
}

