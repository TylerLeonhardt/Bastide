var route = require('koa-route');
var mode = require('../../mode');
var render = require('../../render');
var db = require('../../database');
var config = require('../../config/general.json');
var normalizer = require("school_normalizer");

module.exports = function(app) {
  app.use(route.post('/api/registration/signup', signup));

  function *signup() {
    var response = this.request.body || {};

    yield db.query("INSERT into `signups` (name, email, school, ip) VALUES (" + db.escape(response.name) + "," + db.escape(response.email) + ", " + db.escape(response.school) + ", " + db.escape(this.request.cfip) + ")");

    this.body = { status: 'yay' };
  }
  // name email company message
};

