window.Interest = (function() {
  return {
    sendReply: function(reply) {
      ajax("/api/interest/signup", { reply: reply }, function(data) {
        removeClass(".interest-box", "shown");
        addClass(".school-box", "shown");
      });
    },
    schoolSignup: function(school) {
      ajax("/api/interest/school", { school: school, replyId: 0 }, function(data) {
        removeClass(".school-box", "shown");
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
