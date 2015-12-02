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
function updateDietary() {
  var display = "none";
  if (document.getElementById("dietary-2").checked) {
    display = "inherit";
  }
  document.getElementById("dietary-explain").style.display = display;
}
window.onload = function() {
  updateDietary();

  document.getElementById("submit-form").addEventListener("click", function() {
    var form = {
      id: window.USER_ID,
      email: window.USER_EMAIL,
      token: window.TOKEN,
      tshirt: document.getElementById("tshirt").value,
      dietary: document.getElementById("dietary-2").checked,
      dietary_info: document.getElementById("dietary-explain").value,
      transportation: document.getElementById("transport-2").checked,
      resume_url: document.getElementById("url").value,
    };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/confirm");
    xhr.send(JSON.stringify(form));

    var files = document.getElementById("resume-file").files;
    if (files.length > 0) {
      for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = function(e) {
          e = e || window.event;
          var xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/confirm/resume");
          setPercent(0);
          xhr.upload.addEventListener("progress", function(e) {
            console.log(e);
            if (e.lengthComputable) {
              var percentComplete = e.loaded / e.total;
              console.log(percentComplete);
              setPercent(percentComplete * 100);
            } else {
            }
          });
          xhr.setRequestHeader("Content-type", "application/json");
          xhr.send(JSON.stringify({ "resume": e.target.result }));
        };
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
      }
    }
  });
}
