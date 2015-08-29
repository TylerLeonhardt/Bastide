var route = require('koa-route');

var config = require('../../config/general.json').mailforward || {};
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(config.MANDRILL_KEY);

module.exports = function(app) {
	app.use(route.post('/api/contact/email/', email));

	function *email() {
		var response = this.request.body || {};
		var message = {
			"text": response.body,
			"from_email": response.email,
			"from_name": response.name,
			"subject": "Email from KH.org",
			"to": config.mailTo,
			"headers": {
				"Reply-To": response.email
			},
		};

		mandrill_client.messages.send({"message": message, "async": true }, function(result) {
			console.log(result);
		}, function(e) {
			console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		});
		this.body = "true";
	}
}
