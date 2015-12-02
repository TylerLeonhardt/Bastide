var route = require('koa-route');
var mode = require('../../mode');
var render = require('../../render');
var db = require('../../database');
var config = require('../../config/general.json');
var normalizer = require("school_normalizer");
var fs = require('fs');

module.exports = function(app) {
  app.use(route.post('/api/confirm', confirm));
  app.use(route.post('/api/confirm/resume', resume));
  app.use(route.get('/confirm/:user_id/:token', confirm_page));

  function *confirm_page(id, token) {
    var results = yield db.query("SELECT * FROM `confirmations` WHERE id = " + db.escape(id) + " AND token = " + db.escape(token));

    this.body = yield render('confirmation/index', {
      token: db.escape(token),
    });
  }

  function *confirm() {
    var response = this.request.body || {};

    yield db.query("UPDATE `confirmations` SET dietary = " + db.escape(response.dietary) + ", tshirt = " + db.escape(response.tshirt) + ", dietary_info = " + db.escape(response.dietary_info) + ", transportation = " + db.escape(response.transportation) + ", resume_url = " + db.escape(response.resume_url) + ", ip = " + db.escape(this.request.cfip) + ", has_confirmed = 1 WHERE id = " + db.escape(response.id) + " AND token = " + db.escape(response.token));

    this.body = { status: 'yay' };
  }
  // name email company message

  function *get_csv(key) {
    if (key === config.secret_key) {
      var results = yield db.query("SELECT * FROM `signups`");
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
  function *resume() {
    var response = this.request.body || {};
    var file = response.resume.split("base64,")[1];
    fs.writeFile("tmpfiles/" + (new Date).getTime() + ".pdf", file, 'base64', function(err) {
      console.log(err);
    });
    this.body = { status: 'yay' };
  }
};

