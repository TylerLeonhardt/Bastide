var route = require('koa-route');
var mode = require('../../mode');
var render = require('../../render');

module.exports = function(app) {
  app.use(route.post('/api/interest/signup', interest_signup));
  app.use(route.get('/', home));
  app.use(route.get('/butts', interest_signup));

  function *home() {
    console.log("home!");
    if (!checkMode(this)) return;
    this.body = yield render('interest/index', {});
  }


  function *interest_signup() {
    console.log("yi");
    if (restrictAccess(this)) return;

    console.log(this.request.body);
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

