var route = require('koa-route');
var mode = require('../../mode');
var render = require('../../render');
var db = require('../../database');

module.exports = function(app) {
  app.use(route.post('/api/interest/signup', interest_signup));
  app.use(route.post('/api/interest/school', school_signup));
  app.use(route.post('/api/interest/newsletter', email_signup));
  app.use(route.get('/', home));

  function *home() {
    console.log("home!");
    if (!checkMode(this)) return;
    this.body = yield render('interest/index', {});
  }

  function *interest_signup() {
    if (restrictAccess(this)) return;
    var response = this.request.body.reply;

    if (["yes", "maybe"].indexOf(response) === -1) {
      this.body = "https://www.youtube.com/watch?v=OdLRZzCf_kk";
      return;
    }

    var token;
    if (this.request.body.token) {
      token = this.request.body.token;
      yield db.query("UPDATE `interests` SET `response` = " + db.escape(response) + " WHERE token = " + db.escape(token));
    } else {
      token = (new Date).getTime().toString(36) + Math.random().toString(36);
      yield db.query("INSERT into `interests` (response, token, ip) VALUES (" + db.escape(response) + "," + db.escape(token) + ", " + db.escape(this.request.ip) + ")");
    }

    this.body = { token: token };
  }

  function *school_signup() {
    if (restrictAccess(this)) return;
	var response = this.request.body.school;
	yield db.query("UPDATE `interests` SET `school` = " + db.escape(response) + " WHERE `token` = " + db.escape(this.request.body.token));

    this.body = "{}";
  }

  function *email_signup() {
    if (restrictAccess(this)) return;
	var email = this.request.body.email;
	yield db.query("UPDATE `interests` SET `email` = " + db.escape(email) + " WHERE `token` = " + db.escape(this.request.body.token));

    this.body = "{}";
  }

  function restrictAccess(that) {
    if (!checkMode()) {
      that.status = 403;
      that.body = "no";
      return true;
    }
    return false;
  }

  function checkMode(that) {
    return mode().name == "interest";
  }
};

