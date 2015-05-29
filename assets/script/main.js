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
	//count examples
	var exampleCount = ($('.example:last-child').index())+1;
	var containerWidth = (exampleCount*100)+'%';
	$('.exampleInside').width(containerWidth);
	var slideWidth = (100/exampleCount)+'%';
	$('.example').width(slideWidth);
	$('.example').css({'box-sizing': 'border-box'});
    $('.example').css({'padding': '0 1.5rem'})
	var counter = 0;
	$('.exampleInside > .example').each (function() {
	    $(this).attr('rel',(counter+1));
	    counter++;
	});
	var x;
	for(x=0;x < exampleCount;x++){
		var index = x+1;
		var button= '<div>'+index+'</div>';
		$('.toggleBtns').append(button);
	}
	$('.toggleBtns > div:first-child').addClass('active');
	//click function
	$('.toggleBtns > div').click(function(){
		var prev = $('.toggleBtns > .active').html();
		var num = $(this).html();
		var percent = '-'+((num-1)*100)+'%';
		if(prev > num){
			var speed = (prev - num)*200;
		}else{
			var speed = (num - prev)*200;
		}
		$('.toggleBtns > .active').removeClass('active');
		$(this).addClass('active');
		$('.exampleInside').animate({'marginLeft':percent},speed);
	});
})