
$(document).ready(function () {

  
});
$(window).scroll(function () {
  $(window).scrollTop() > 20 ? ($(".header-main").addClass("fixed-header"), 
  $(".dashbard-left-menu").addClass("slide-top")) : ($(".header-main").removeClass("fixed-header"), 
  $(".dashbard-left-menu").removeClass("slide-top"));
}),

$(window).load(function() {

  function setHeight() {
    windowHeight = $(window).height();
    $('.banner').css('height', windowHeight);
  };
  setHeight();
 
});

