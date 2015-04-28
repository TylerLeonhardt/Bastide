window.Interest = (function() {
  var token = localStorage ? (localStorage.interestToken || "") : "";

  return {
    sendReply: function(reply) {
      ajax("/api/interest/signup", { reply: reply, token: token }, function(data) {
        token = data.token;

        if (localStorage)
          localStorage.interestToken = token;

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
