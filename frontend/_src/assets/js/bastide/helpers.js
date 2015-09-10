if (!window.Bastide) window.Bastide = {};
window.Bastide.Helpers = {
  validateEmail: function(email) {
      // We're going to be really loose about this, just up to the point where Mandrill will probably not complain
      if (
          email.indexOf("@") === -1 ||
          email.indexOf(".") === -1
      ) {
          return false;
      }
      return true;
  },
}
