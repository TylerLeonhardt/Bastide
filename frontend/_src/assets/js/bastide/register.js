if (!window.Bastide) window.Bastide = {};
window.Bastide.Registration = {
    signup: function() {
        var params = {
            name: document.querySelector('#signUpModal .name').value,
            email: document.querySelector('#signUpModal .email').value,
            school: document.querySelector('#signUpModal .school').value,
        };
        if (window.DEV)
            _handleSignupCompleted();
        else
            Bastide.ajax("/api/registration/signup", params, _handleSignupCompleted);
    }
};

function _handleSignupCompleted(data) {
    $('#signUpCompletedModal').foundation('reveal', 'open');
    $('#signUpModal').foundation('reveal', 'close');
}
