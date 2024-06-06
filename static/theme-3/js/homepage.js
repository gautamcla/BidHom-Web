
$(document).ready(function () {

  
});
$(window).scroll(function () {
  $(window).scrollTop() > 20 ? ($(".header").addClass("fixed-header"), 
  $(".dashbard-left-menu").addClass("slide-top")) : ($(".header").removeClass("fixed-header"), 
  $(".dashbard-left-menu").removeClass("slide-top"));
}),

$(window).load(function() {

  function setHeight() {
    windowHeight = $(window).height();
    $('.banner').css('height', windowHeight);
  };
  setHeight();

  if ($(window).width() < 960) {
    $('.banner').css('height', windowHeight / 2);
  }
  else {
    setHeight();
  }

 
});

