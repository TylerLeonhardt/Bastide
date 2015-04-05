window.Interest = (function() {
  return {
    sendReply: function(reply) {
      ajax("/api/interest/signup", { reply: reply }, function(data) {
        document.querySelector(".interest-box").className += " hidden";
        document.querySelector(".mailing-list").className += " shown";
      });
    }
  };
})();
