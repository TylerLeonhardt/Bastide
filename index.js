var koa = require('koa');
var route = require('koa-route');

var render = require('./render');

var modes = require('./config/modes.json');

var app = koa();
app.use(route.get('/', home));

function *home() {
  var currentDate = (new Date).getTime();
  var currentMode;

  for (var i = 0; i < modes.length; i++) {
    if (currentDate > Date.parse(modes[i].start)) {
      currentMode = modes[i];
    }
  }

  console.log(currentMode);
  this.body = yield render(currentMode.name + '/index', {});
}

app.listen(8300);
