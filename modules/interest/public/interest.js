window.Interest = (function() {
  var token = "";

  return {
    sendReply: function(reply) {
      ajax("/api/interest/signup", { reply: reply }, function(data) {
        token = data.token;

        removeClass(".interest-box", "shown");
        addClass(".school-box", "shown");
        document.querySelector(".school-box input[type=text]").focus();
      });
    },
    schoolSignup: function(school) {
      ajax("/api/interest/school", { school: school, token: token }, function(data) {
        removeClass(".school-box", "shown");
        addClass(".mailing-list", "shown");
        document.querySelector(".mailing-list input[type=text]").focus();
      });
    },
    mailSignup: function(email) {
      ajax("/api/interest/newsletter", { email: email, token: token }, function(data) {
        removeClass(".mailing-list", "shown");
        addClass(".thanks", "shown");
      });
    }
  };
})();
