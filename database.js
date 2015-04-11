var mysql = require('mysql');
var config = require('./config/db.json');

var connection = mysql.createConnection(config);

connection.connect();

module.exports.query = function(query) {
	return function(callback) {
		try {
			connection.query(query, callback);
		} catch (e) {
			console.log(e);
			connection.connect();
			try {
				connection.query(query, callback);
			} catch(e) {
				console.log(e);
			}
		}
	}
}

module.exports.escape = function(str) {
	return connection.escape(str);
}

