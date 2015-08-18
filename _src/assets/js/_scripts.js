$(document).ready(function() {
    var resetZIndex     = false;
    var navButtonActive = false;

    $(document).foundation();

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

    // $('#fullpage').fullpage({
        //Navigation
        // anchors:['home', 'sponsors', 'faq'],

        //Custom selectors
        // sectionSelector: '.page',

        // Fixed elements
        //fixedElements: '.end',

        // Events
        // onLeave: function(index, nextIndex, direction){
        //     if (resetZIndex) {
        //         $('section.end').css('zIndex', 1);
        //     }
        // },
        // afterLoad: function(anchorLink, index) {
        //     if (anchorLink === 'talk') {
        //         $('section.end').css('zIndex', 3);
        //
        //         resetZIndex = true;
        //     }
        // }
    // });

    $('form[role=form').submit(function(e) {
        e.preventDefault();

        $.ajax({
            url: '//formspree.io/me@ericcolon.com',
            method: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            beforeSend: function() {
                $('button[type=submit]').html('Sending...');
            },
            success: function(data) {
                $('button[type=submit]').html('Sent! ;)');
            },
            error: function(err) {
                $('button[type=submit]').html('Not so fast, hot shot');
            }
        });
    });
});
