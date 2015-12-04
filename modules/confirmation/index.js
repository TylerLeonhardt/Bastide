var route = require('koa-route');
var mode = require('../../mode');
var render = require('../../render');
var db = require('../../database');
var config = require('../../config/general.json');
var normalizer = require("school_normalizer");
var fs = require('fs');

module.exports = function(app) {
  app.use(route.post('/api/confirm', confirm));
  app.use(route.get('/confirm/:user_id/:token', confirm_page));
  app.use(route.get('/api/confirm/logo/:token', has_seen_email));
  app.use(route.get('/api/confirm/csv/:key', get_csv));

  function _expired(result) {
    return ((new Date).getTime() / 1000) > (result.available_since + 3600 * 24 * 3);
  }

  function *confirm_page(id, token) {
    var results = yield db.query("SELECT * FROM `confirmations` WHERE id = " + db.escape(id) + " AND token = " + db.escape(token));
    results = results[0];

    if (results.length < 1) {
      this.body = "404";
      return;
    }

    this.body = yield render('confirmation/index', {
      token: results[0].token,
      id: results[0].id,
      email: results[0].email,
      name: results[0].name,
      expired: _expired(results[0]),
      done: !!results[0].has_confirmed,
    });
  }

  function *confirm() {
    var response = this.request.body || {};
    console.log(response);

    var results = yield db.query("SELECT * FROM `confirmations` WHERE id = " + db.escape(response.id) + " AND token = " + db.escape(response.token));
    results = results[0];

    if (results.length > 0 && results[0].token == response.token) {
      if (_expired(results[0])) {
	this.body = { "status": "expired" };
	return;
      }
      yield db.query("UPDATE `confirmations` SET dietary = " + db.escape(response.dietary) + ", tshirt = " + db.escape(response.tshirt) + ", dietary_info = " + db.escape(response.dietary_info) + ", transportation = " + db.escape(response.transportation) + ", resume_url = " + db.escape(response.resume_url) + ", ip = " + db.escape(this.request.cfip) + ", has_confirmed = 1 WHERE id = " + db.escape(response.id) + " AND token = " + db.escape(response.token));

      if (response.resume) {
	var file = response.resume.split("base64,")[1];
	fs.writeFile("tmpfiles/" + results[0].id + "_" + (new Date).getTime() + ".pdf", file, 'base64', function(err) {
	  console.log(err);
	});
      }

      this.body = { status: 'yay' };
    } else {
      this.body = { status: 'bad token' };
    }
  }
  // name email company message

  function *get_csv(key) {
    if (key === config.secret_key) {
      var results = yield db.query("SELECT * FROM `confirmations`");
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

  function *has_seen_email(token) {
    var results = yield db.query("UPDATE `confirmations` SET has_seen_email = 1 WHERE token = " + db.escape(token));
    results = results[0];

    this.response.redirect("https://knighthacks.org/assets/img/logo.png");
  }
};

