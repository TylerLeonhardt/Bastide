if (!window.Bastide) window.Bastide = {};
window.Bastide.Contact = {
    sendEmail: function() {
        var params = {
            name: document.querySelector('#emailModal .name').value,
            email: document.querySelector('#emailModal .email').value,
            school: document.querySelector('#emailModal .message').value,
        };
        if (window.DEV)
            _handleEmailCompleted();
        else
            Bastide.ajax("/api/contact/email", params, _handleEmailCompleted);
    }
};

function _handleEmailCompleted(data) {
    $('#emailCompletedModal').foundation('reveal', 'open');
    $('#emailModal').foundation('reveal', 'close');
}

