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
    xhr.setRequestHeader("Content-type", "application/json");

    var files = document.getElementById("resume-file").files;
    if (files.length > 0) {
      for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = function(e) {
          e = e || window.event;
          form.resume = e.target.result;
          xhr.send(JSON.stringify(form));
        };
        reader.readAsDataURL(f);
      }
    } else {
      xhr.send(JSON.stringify(form));
    }
  });
}
