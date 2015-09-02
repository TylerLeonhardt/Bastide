$(document).ready(function() {
    $(document).foundation();
    smoothScroll.init();

    var navButtonActive = false;

    $('.nav-menu__button').click(function(e) {
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

    // Modal open/close bindings
    $(document).on('open.fndtn.reveal', '[data-reveal]', function () {
      $('body').addClass('modal-active');
    });

    $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
      $('body').removeClass('modal-active');
    });
});
