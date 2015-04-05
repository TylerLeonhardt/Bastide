function interested() {
  ajax("/api/interest/signup", { user: "me", pw: "hi" }, function(data) {
    console.log("ya");
  });
}

function ajax(url, data, callback) {
  var method = "POST";
  if (arguments.length < 2) {
    callback = data;
    data = null;
    method = "GET";
  } else {
    data = JSON.stringify(data);
  }

  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = function() {
    var returneddata = JSON.parse(xhr.responseText);
    callback(returneddata);
  };
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(data);

}

