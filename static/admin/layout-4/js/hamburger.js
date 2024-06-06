$('.burger, .overlay').click(function(){
  $('.burger').toggleClass('clicked');
  $('.overlay').toggleClass('show');
  $('.filter-sidebar').toggleClass('show');
  $('body').toggleClass('overflow');
});