var route = require('koa-route');

var config = require('../../config/general.json').mailforward || {};
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(config.MANDRILL_KEY);

// Make a thunk out of the Mandrill send method
var mandrill_send = function(message) {
	var f = function(callback) {
		mandrill_client.messages.send({"message": message, "async": true }, function(result) {
			callback(null, result);
		}, function(e) {
			callback(e, false);
			console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		});
	};
	return f;
}

module.exports = function(app) {
	app.use(route.post('/api/contact/email/', email));

	function *email() {
		var response = this.request.body || {};
		var subject = "Email from KH.org";
		if (response.company) {
			subject = "Sponsor email from " + response.company;
		}
		var message = {
			"text": response.body,
			"from_email": response.email,
			"from_name": response.name,
			"subject": subject,
			"to": config.mailTo,
			"headers": {
				"Reply-To": response.email
			},
		};

		var result = yield mandrill_send(message);

		this.body = (!!result).toString();
	}
}
