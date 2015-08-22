$(document).ready(function() {
    var resetZIndex     = false;
    var navButtonActive = false;

    $('.nav-menu__button').click(function(e) {
      console.log(navButtonActive);

      if (!navButtonActive) {
        $(this).parent().addClass('active');

        navButtonActive = true;
      } else {
        $(this).parent().removeClass('active');

        navButtonActive = false;
      }
    });

    $('.nav-menu a').click(function(e) {
      $('.nav-menu').removeClass('active');
      navButtonActive = false;
    });

    // $('form[role=form').submit(function(e) {
    //     e.preventDefault();
    //
    //     $.ajax({
    //         url: '//formspree.io/me@ericcolon.com',
    //         method: 'POST',
    //         data: $(this).serialize(),
    //         dataType: 'json',
    //         beforeSend: function() {
    //             $('button[type=submit]').html('Sending...');
    //         },
    //         success: function(data) {
    //             $('button[type=submit]').html('Sent! ;)');
    //         },
    //         error: function(err) {
    //             $('button[type=submit]').html('Not so fast, hot shot');
    //         }
    //     });
    // });
});
