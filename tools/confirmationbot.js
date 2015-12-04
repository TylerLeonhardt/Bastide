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
<div style="text-align: center">
	<img src="https://knighthacks.org/api/confirm/logo/{{token}}" width="400px" style="max-width:90%" alt="Knight Hacks">
</div>

<b style="font-size: 20px">Great news: You've been accepted to participate in Knight Hacks!</b><br><br>

Let us know if you can make it by clicking the big button below:<br><br>

<div style="text-align:center">
	<a href="http://knighthacks.org/confirm/{{id}}/{{token}}" style="padding: 20px 40px;background:#16a9c1;color:#fff;text-decoration:none;font-size:24px;">Yes, I'm going!</a>
</div>

<br>
Or by using this long, boring, plaintext link:<br>
http://knighthacks.org/confirm/{{id}}/{{token}}<br><br>

You <b>must</b> fill out this form <b>within 3 days</b> to attend! Otherwise, your spot will be reallocated into the lottery pool. Don't worry, it's super quick! :)<br><br>

Once you've confirmed, be sure to check out <a href="https://www.facebook.com/groups/knighthacks">Knight Hacks Hackers</a> to chat with fellow attendees and organizers, form teams, and coordinate rides!

If you have any questions, do not hesistate to ask!<br><br>

Happy Hacking!<br>
Knight Hacks Team<br><br>

<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@type": "EmailMessage",
  "potentialAction": {
    "@type": "ViewAction",
	"target": "https://knighthacks.org/register",
    "name": "Confirm"
  },
  "description": "Confirm Knight Hacks Attendance"
}
</script>
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
	var shasum = crypto.createHash('sha1');
	shasum.update(email + Math.random().toString(36));
	var token = (new Date).getTime().toString(36) + shasum.digest('hex') + (Math.floor((Math.random() * 100000))).toString(36);
	console.log(token);

	console.log("	Cross-referencing their info from the DB");
	var signupResult = yield db.query("SELECT * FROM `signups` WHERE email = " + db.escape(email));
	signupResult = signupResult[0][0];

	console.log("	[Info] We are inviting " + signupResult.name + " from " + signupResult.school);

	console.log("	Inserting into db");
	var query_results = yield db.query("INSERT INTO `confirmations` (email, name, school, token, available_since) VALUES (" + db.escape(email) + "," + db.escape(signupResult.name) + "," + db.escape(signupResult.school) + "," + db.escape(token) + ", " + db.escape(Math.round((new Date).getTime() / 1000)) + ")");

	console.log("	Sending Mandrill email");

	var emailBody = EMAIL_TEMPLATE.replace(/\{\{token\}\}/g, token).replace(/\{\{id\}\}/g, query_results[0].insertId);
	var result = yield mandrill_send({
		html: emailBody,
		from_email: "team@knighthacks.org",
		from_name: "Knight Hacks",
		subject: "[Action Needed] You're going to Knight Hacks! 🌃🖥",
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
