// Multi-Toggle Navigation
$(function() {
	$('body').addClass('js');
		var	$menu = $('#menu'),
			$menulink = $('.menu-link'),
			$menuTrigger = $('.has-subnav');

	$menulink.click(function(e) {
		e.preventDefault();
		$menulink.toggleClass('active');
		$menu.toggleClass('active');
	});

	$menuTrigger.click(function(e) {
		e.preventDefault();
		var $this = $(this);
		$this.toggleClass('active').next('ul').toggleClass('active');
	});

});

// Remove "Active" Class from Menu on Resize
$(window).resize(function() {
	var viewportWidth = $(window).width();
		if (viewportWidth > 925) {
			$("#menu").removeClass("active");
		}
});
