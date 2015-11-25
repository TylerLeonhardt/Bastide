var route = require('koa-route');
var mode = require('../../mode');
var render = require('../../render');
var db = require('../../database');
var config = require('../../config/general.json');
var normalizer = require("school_normalizer");

module.exports = function(app) {
  app.use(route.post('/api/registration/signup', signup));
  app.use(route.get('/api/registration/csv/:key', get_csv));
  app.use(route.get('/confirm/:user_id/:key', confirm_page));

  function *confirm_page(key) {
    this.body = yield render('confirmation/index', {});
  }

  function *signup() {
    var response = this.request.body || {};

    yield db.query("INSERT into `signups` (name, email, school, ip) VALUES (" + db.escape(response.name) + "," + db.escape(response.email) + ", " + db.escape(response.school) + ", " + db.escape(this.request.cfip) + ")");

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
};

