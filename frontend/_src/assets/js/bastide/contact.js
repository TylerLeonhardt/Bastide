if (!window.Bastide) window.Bastide = {};
window.Bastide.Contact = {
    sendEmail: function() {
        var params = {
            name: document.querySelector('#emailModal .name').value,
            email: document.querySelector('#emailModal .email').value,
            body: document.querySelector('#emailModal .message').value,
        };
        if (!_validateEmail(params.email)) {
            document.querySelector('#emailModal .errors').className += ' visible';
            return;
        }
        if (window.DEV)
            _handleEmailCompleted();
        else
            Bastide.ajax("/api/contact/email", params, _handleEmailCompleted);
    },
    sendSponsorEmail: function() {
        var params = {
            name: document.querySelector('#sponsorsModal .name').value,
            email: document.querySelector('#sponsorsModal .email').value,
            body: document.querySelector('#sponsorsModal .message').value,
            company: document.querySelector('#sponsorsModal .company').value,
        };
        if (!_validateEmail(params.email)) {
            document.querySelector('#sponsorsModal .errors').className += ' visible';
            return;
        }
        if (window.DEV)
            _handleEmailCompleted();
        else
            Bastide.ajax("/api/contact/email", params, _handleEmailCompleted);
    }
};

function _handleEmailCompleted(data) {
    if (data) {
        $('#emailCompletedModal').foundation('reveal', 'open');
        $('#emailModal').foundation('reveal', 'close');
        $('#sponsorsModal').foundation('reveal', 'close');
    } else {
        alert("There was a problem sending your email. Please make sure all fields are filled out properly. If this problem persists, send us an email with your mail client to team@knighthacks.org");
    }
}

function _validateEmail(email) {
    // We're going to be really loose about this, just up to the point where Mandrill will probably not complain
    if (
        email.indexOf("@") === -1 ||
        email.indexOf(".") === -1
    ) {
        return false;
    }
    return true;
}
