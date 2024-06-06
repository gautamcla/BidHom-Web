$(window).scroll(function () {
  $(window).scrollTop() > 20 ? ($(".header").addClass("fixed-header"), 
  $(".dashbard-left-menu").addClass("slide-top")) : ($(".header").removeClass("fixed-header"), 
  $(".dashbard-left-menu").removeClass("slide-top"));
});