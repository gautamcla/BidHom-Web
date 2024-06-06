$('.burger, .overlayy').click(function(){
  $('.select').chosen();
  $('.burger').toggleClass('clicked');
  $('.overlayy').toggleClass('show');
  $('.filter-sidebar').toggleClass('show');
  $('body').toggleClass('overflow');
});