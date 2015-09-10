if (!window.Bastide) window.Bastide = {};
window.Bastide.Contact = {
    sendEmail: function() {
        var nameInput = document.querySelector('#emailModal .name'),
            emailInput = document.querySelector('#emailModal .email'),
            bodyInput = document.querySelector('#emailModal .message');

        var params = {
            name: nameInput.value,
            email: emailInput.value,
            body: bodyInput.value,
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
        if (!params.body) {
            error = true;
            bodyInput.className += " invalid";
        }
        var errorMessage = document.querySelector('#emailModal .errors');
        if (error) {
            errorMessage.className += ' visible';
            return false;
        } else {
            errorMessage.className = errorMessage.className.replace(/ visible/g, '');
        }

        document.querySelector('#sponsorsModal .button').className += ' loading';

        if (window.DEV)
            _handleEmailCompleted();
        else
            Bastide.ajax("/api/contact/email", params, _handleEmailCompleted);
    },
    sendSponsorEmail: function() {
        var nameInput = document.querySelector('#sponsorsModal .name'),
            emailInput = document.querySelector('#sponsorsModal .email'),
            bodyInput = document.querySelector('#sponsorsModal .message'),
            companyInput = document.querySelector('#sponsorsModal .company');
        var params = {
            name: nameInput.value,
            email: emailInput.value,
            body: bodyInput.value,
            company: companyInput.value,
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
        if (!params.body) {
            error = true;
            bodyInput.className += " invalid";
        }
        var errorMessage = document.querySelector('#sponsorsModal .errors');
        if (error) {
            errorMessage.className += ' visible';
            return false;
        } else {
            errorMessage.className = errorMessage.className.replace(/ visible/g, '');
        }

        document.querySelector('#sponsorsModal .button').className += ' loading';

        if (window.DEV)
            _handleEmailCompleted();
        else
            Bastide.ajax("/api/contact/email", params, _handleEmailCompleted);
    }
};

function _handleEmailCompleted(data) {
    var sponsorsButton = document.querySelector('#sponsorsModal .button');
    var emailButton = document.querySelector('#emailModal .button');
    sponsorsButton.className = sponsorsButton.className.replace(/ loading/g, '');
    emailButton.className = emailButton.className.replace(/ loading/g, '');
    if (data) {
        $('#emailModal').foundation('reveal', 'close');
        $('#sponsorsModal').foundation('reveal', 'close');
        setTimeout(function() {
            $('#emailCompletedModal').foundation('reveal', 'open');
        }, 250);
    } else {
        alert("There was a problem sending your email. Please make sure all fields are filled out properly. If this problem persists, send us an email with your mail client to team@knighthacks.org");
    }
}
