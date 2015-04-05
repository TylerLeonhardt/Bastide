var modes = require('./config/modes.json');

module.exports = function() {
  var currentDate = (new Date).getTime();
  var currentMode;

  for (var i = 0; i < modes.length; i++) {
    if (currentDate > Date.parse(modes[i].start)) {
      currentMode = modes[i];
    }
  }

  return currentMode;
}

