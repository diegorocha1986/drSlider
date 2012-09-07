/* Author:

*/

(function($){

	$('#wrapper-slider').drSlider({
		shownav 	: true,
		visible 	: 1,
		walk 		: 1
	});

	document.getElementById('destroy-slider').onclick = function(){
		$('#wrapper-slider').drSlider('destroy');
	}

	document.getElementById('build-slider').onclick = function(){
		$('#wrapper-slider').drSlider({
			shownav 	: true,
			visible 	: 1,
			walk 		: 1
		});
	}

})(jQuery);