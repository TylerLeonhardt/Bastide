var mysql = require('mysql');
var config = require('./config/db.json');

var connection = mysql.createConnection(config);

connection.connect();

module.exports.query = function(query) {
	return function(callback) {
		connection.query(query, callback);
	}
}

module.exports.escape = function(str) {
	return connection.escape(str);
}

