$(document).ready(function() {
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
});
