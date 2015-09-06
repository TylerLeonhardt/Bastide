$(document).ready(function() {
    $(document).foundation();
    smoothScroll.init();

    $('.nav-menu__button').click(function(e) {
      if (!$('.nav-menu').hasClass('active')) {
        $('.nav-menu').addClass('active');
        $('.nav-menu__button').attr('aria-expanded', 'true');
        $('.nav-menu ul').attr('aria-hidden', 'false');
      } else {
        $('.nav-menu').removeClass('active');
        $('.nav-menu__button').attr('aria-expanded', 'false');
        $('.nav-menu ul').attr('aria-hidden', 'true');
      }
    });

    $('.nav-menu a').click(function(e) {
      $('.nav-menu').removeClass('active');
      navButtonActive = false;
    });

    // Modal open/close bindings
    $(document).on('open.fndtn.reveal', '[data-reveal]', function () {
      $('body').addClass('modal-active');
    });

    $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
      $('body').removeClass('modal-active');
    });
});
