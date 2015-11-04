if (!window.Bastide) window.Bastide = {};
window.Bastide.Registration = {
    signup: function() {
        var nameInput = document.querySelector('#signUpModal .name'),
            emailInput = document.querySelector('#signUpModal .email'),
            schoolInput = document.querySelector('#signUpModal .school');

        var params = {
            name: nameInput.value,
            email: emailInput.value,
            school: schoolInput.value,
        };

        var error = false;
        if (!params.name) {
            error = true;
            nameInput.className += " invalid";
        }
        if (!params.email || !Bastide.Helpers.validateEmail(params.email)) {
            error = true;
            emailInput.className += " invalid";
        }
        if (!params.school) {
            error = true;
            schoolInput.className += " invalid";
        }
        var errorMessage = document.querySelector('#signUpModal .errors');
        if (error) {
            errorMessage.className += ' visible';
            return false;
        } else {
            errorMessage.className = errorMessage.className.replace(/ visible/g, '');
        }

        if (window.DEV)
            _handleSignupCompleted();
        else
            Bastide.ajax("/api/registration/signup", params, _handleSignupCompleted);
    }
};

function _handleSignupCompleted(data) {
    $('#signUpModal').foundation('reveal', 'close');
    $('.single-page-registration-form').addClass('success');
    setTimeout(function() {
        $('#signUpCompletedModal').foundation('reveal', 'open');
        $('.single-page-registration-form').addClass('hidden');
        $('.single-page-registration-success').addClass('visible');
    }, 250);
}
