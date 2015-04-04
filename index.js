var koa = require('koa');
var route = require('koa-route');

var app = koa();
app.use(route.get('/', home));

function *home() {
  this.body = "hello!!!";
}

app.listen(8300);
