/* stop reading pls i had like 1 hour to make this */
var _ = function(id) { return document.getElementById(id); };

function updateDietary() {
  var display = "none";
  if (_("dietary-2").checked) {
    display = "inherit";
  }
  _("dietary-explain").style.display = display;
}
window.onload = function() {
  if (ALREADY_DONE) {
    _("form-content").className = 'hidden';
    _("already-done").className += ' visible';
  } else if (EXPIRED) {
    _("form-content").className = 'hidden';
    _("expired").className += ' visible';
  }
  updateDietary();

  _("submit-form").addEventListener("click", function() {
    if (!_("agree").checked) {
      alert("Going old school and using an alert to point out that you need to agree to the code of conduct before confirming.");
      return;
    }

    var form = {
      id: window.USER_ID,
      email: window.USER_EMAIL,
      token: window.TOKEN,
      tshirt: _("tshirt").value,
      dietary: _("dietary-2").checked,
      dietary_info: _("dietary-explain").value,
      transportation: _("transport-2").checked,
      resume_url: _("url").value,
    };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/confirm");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onload = function() {
      _("loader").className = 'hidden';
      try {
        if (JSON.parse(xhr.responseText).status === 'yay') {
          _("success").className += ' visible';
          return;
        }
      } catch (e) {
      }
      alert("Something went wrong. Here's what the server said: " + xhr.responseText);
      _("form-content").className = 'visible';
    };

    var files = _("resume-file").files;
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
    _("form-content").className = 'hidden';
    _("loader").className += ' visible';
  });
}
