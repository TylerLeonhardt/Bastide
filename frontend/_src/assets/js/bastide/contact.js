if (!window.Bastide) window.Bastide = {};
window.Bastide.Contact = {
    sendEmail: function() {
        var params = {
            name: document.querySelector('#emailModal .name').value,
            email: document.querySelector('#emailModal .email').value,
            body: document.querySelector('#emailModal .message').value,
        };
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
    } else {
        alert("There was a problem sending your email. Please make sure all fields are filled out properly. If this problem persists, send us an email with your mail client to team@knighthacks.org");
    }
}

