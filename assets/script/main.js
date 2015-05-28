$(document).ready(function(){
	var $root = $('html, body');
	$('.nav').click(function(event) {
		event.preventDefault();
	    var href = $.attr(this, 'href');
	    $root.animate({
	        scrollTop: ($(href).offset().top)-15
	    }, 500, function () {
	        window.location.hash = href;
	    });
	    return false;
	});
})