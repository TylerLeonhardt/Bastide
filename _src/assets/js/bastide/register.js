if (!window.Bastide) window.Bastide = {};
window.Bastide.Registration = {
    signup: function() {
        var params = {
            name: document.querySelector('#signUpModal .name').value,
            email: document.querySelector('#signUpModal .email').value,
            school: document.querySelector('#signUpModal .school').value,
        };
        Bastide.ajax("/api/registration/signup", params, function() {
            alert("YE");
        });
    }
};
