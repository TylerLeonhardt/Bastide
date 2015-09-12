var route = require('koa-route');
var db = require('../../database');

module.exports = function(app) {
  app.use(route.post('/api/mailinglist/subscribe', subscribe));

  function *subscribe() {
    var email = this.request.body.email;

    if (!this.request.body.email) {
      return;
    }

    yield db.query("INSERT into `mailinglist` (email, ip) VALUES (" + db.escape(email) + ", " + db.escape(this.request.cfip) + ")");

    this.body = { callback: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" };
  }
};

