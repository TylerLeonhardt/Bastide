var route = require('koa-route');
var mode = require('../../mode');
var render = require('../../render');
var db = require('../../database');

module.exports = function(app) {
  app.use(route.post('/api/interest/signup', interest_signup));
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

	yield db.query("INSERT into `interests` (response) VALUES (" + db.escape(response) + ")");

    this.body = "{}";
  }

  function *email_signup() {
    if (restrictAccess(this)) return;

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

