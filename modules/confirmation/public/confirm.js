function setPercent(percent) {
  var text = "[";
  var MAX = 20;
  var numEquals = (percent / 100 * MAX);
  for (var i = 0; i < numEquals; i++) {
    text += "=";
  }
  text += ">";
  for (var i = 0; i < (MAX - numEquals); i++) {
    text += " ";
  }
  text += "] " + (Math.floor(percent) + "%");
  document.getElementById("equals").innerHTML = text;
}
function startLoading(percent) {
  setPercent(percent);
  if (percent < 100) {
    setTimeout("startLoading(" + (percent + 5) + ")", 50);
  }
}
setTimeout(function() {
  startLoading(0);
}, 10);

