window.Interest = (function() {
  return {
    sendReply: function(reply) {
      ajax("/api/interest/signup", { reply: reply }, function(data) {
        removeClass(".interest-box", "shown");
        addClass(".mailing-list", "shown");
      });
    },
    mailSignup: function(email) {
      ajax("/api/interest/newsletter", { email: email }, function(data) {
        removeClass(".mailing-list", "shown");
        addClass(".thanks", "shown");
      });
    }
  };
})();
