var route = require('koa-route');
var mode = require('../../mode');
var render = require('../../render');
var db = require('../../database');
var config = require('../../config/general.json');
var normalizer = require("school_normalizer");

module.exports = function(app) {
  app.use(route.post('/api/interest/signup', interest_signup));
  app.use(route.post('/api/interest/school', school_signup));
  app.use(route.post('/api/interest/newsletter', email_signup));
  app.use(route.get('/api/interest/csv/:key', get_csv));
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
      yield db.query("INSERT into `interests` (response, token, ip) VALUES (" + db.escape(response) + "," + db.escape(token) + ", " + db.escape(this.request.cfip) + ")");
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

  function *get_csv(key) {
    if (key === config.secret_key) {
      var results = yield db.query("SELECT * FROM `interests`");
      var csvdata = "";

      results[0].forEach(function(result) {
	for (key in result) {
	  if (key == "school") {
	    result[key] = normalizer.getStandardName(result[key] || "unknown");
	  }
	  csvdata += result[key] + ",";
	}
	csvdata += "\n";
      });
      this.body = csvdata;
    } else {
      this.body = null;
      this.status = 404;
    }
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

