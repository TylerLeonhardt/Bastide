var koa = require('koa');
var route = require('koa-route');
var serve = require('koa-static');
var koaBody = require('koa-body');
var koaCfIp = require('./koa-cf');

var render = require('./render');

var yfs = require('./yfs');

var mode = require('./mode');
var modules = require('./config/modules.json');

var app = koa();
app.use(serve('site/public'));
app.use(koaBody());
app.use(koaCfIp());

for (var i = 0; i < modules.length; i++) {
  require('./modules/' + modules[i] + '/index.js')(app);
}

app.use(route.get('/modules/([A-Za-z0-9]+)/(.*)', function* (module, file) {
  var data = yield yfs.readFile("modules/" + module + "/public/" + file);
  var ext = file.split('.');
  ext = ext[ext.length - 1];
  if (ext === "css") {
	this.set("Content-type", "text/css");
  }
  if (ext === "js") {
	this.set("Content-type", "application/javascript");
  }
  this.body = data;
}));

app.listen(8300);

