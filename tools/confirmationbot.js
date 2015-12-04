var fs = require('fs');
var crypto = require('crypto');

var db = require('../database');
var co = require('co');


var config = require('../config/general.json').mailforward || {};
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
var EMAIL_TEMPLATE = `
Hi there! You've been accepted to participate in Knight Hacks!

To confirm that you are able to go, please go to http://knighthacks.org/confirm/{{id}}/{{token}}. You *must* fill out this form in order to attend! Also, this confirmation *must* be filled out within 3 days, or your spot will be reallocated into the lottery pool.

One more time: you *must* confirm to attend, and you must do so in the next 3 days!

Don't worry, it's super quick :)

If you have any questions, do not hesistate to ask!

Happy Hacking!
Knight Hacks Team
`;
var inputfile = fs.readFileSync("confirmation-list.csv").toString();
var emails = inputfile.split("\n");

console.log("Creating confirmation entries for " + emails.length + " people...");
console.log(emails);
co(function*() {
yield emails.map((function* (email) {
	if (!email) return;

	console.log(email);
	console.log("	Generating token");
	shasum = crypto.createHash('sha1');
	shasum.update(email + Math.random().toString(36));
	token = (new Date).getTime().toString(36) + shasum.digest('hex') + (Math.floor((Math.random() * 100000))).toString(36);
	console.log(token);

	console.log("	Cross-referencing their info from the DB");
	var signupResult = yield db.query("SELECT * FROM `signups` WHERE email = " + db.escape(email));
	signupResult = signupResult[0][0];

	console.log("	[Info] We are inviting " + signupResult.name + " from " + signupResult.school);

	console.log("	Inserting into db");
	var query_results = yield db.query("INSERT INTO `confirmations` (email, name, school, token, available_since) VALUES (" + db.escape(email) + "," + db.escape(signupResult.name) + "," + db.escape(signupResult.school) + "," + db.escape(token) + ", " + db.escape(Math.round((new Date).getTime() / 1000)) + ")");

	console.log("	Sending Mandrill email");

	var emailBody = EMAIL_TEMPLATE.replace("{{token}}", token).replace("{{id}}", query_results[0].insertId);
	var result = yield mandrill_send({
		text: emailBody,
		from_email: "team@knighthacks.org",
		from_name: "Knight Hacks",
		subject: "[Action Needed] You're going to Knight Hacks!",
		to: [{
			email: email,
			type: 'to'
		}],
	});
	if (result) {
		yield db.query("UPDATE `confirmations` SET email_sent = 1 WHERE token = " + db.escape(token));
	} else {
		console.warn("!!!!!! FAILED FOR " + email);
	}


	return email;
}))}).then(function(emails) {
	console.log(emails);
	console.log("Done.");
});
