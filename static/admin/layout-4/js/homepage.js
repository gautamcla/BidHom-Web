

$(window).scroll(function () {
  $(window).scrollTop() > 20 ? ($(".header").addClass("fixed-header"), 
  $(".dashbard-left-menu").addClass("slide-top")) : ($(".header").removeClass("fixed-header"), 
  $(".dashbard-left-menu").removeClass("slide-top"));
}),

$(window).load(function() {
  if ($(window).width() < 960) {
    $('.banner').css('height', windowHeight / 2);
  }
  else {
    setHeight();
  }
 
});

