var koa = require('koa');
var route = require('koa-route');
var serve = require('koa-static');
var jsonBody = require('koa-json-body');

var render = require('./render');

var mode = require('./mode');
var modules = require('./config/modules.json');

var app = koa();
app.use(serve('site/public'));
app.use(jsonBody());

for (var i = 0; i < modules.length; i++) {
  require('./modules/' + modules[i] + '/index.js')(app);
}

app.listen(8300);
