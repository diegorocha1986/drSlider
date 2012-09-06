// Copyright 2012 Diego Rocha
// http://diegorocha.me/

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


(function($){

	var _private 	= {
			create 		: {
				wrapList 			: function(){
					console.log('Executei: wrapList;');
					var data 		= $.data($(this)[0], 'drSlider');

					data.$slider.css({
						width 		: data.listItemsOpts.width,
						overflow 	: 'hidden',
						position 	: 'relative'
					});

					data.$list.wrap('<div id="drslider-overflow" />');
					data.$overflow = $('#drslider-overflow');
					
					data.$overflow.css({
						width 		: (data.listItemsOpts.width * data.listItemsOpts.length),
						position 	: 'relative'
					});

					$.data($(this)[0], 'drSlider', data);
				},
				createNavLinks 		: function(){
					console.log('Executei: createNavLinks;');
					var data 		= $.data($(this)[0],'drSlider'),
						container 	= document.createElement('p'),
						amount 		= Math.ceil(data.listItemsOpts.length/data.visible),
						links 		= [],
						i;

					container.className 	= 'container-nav';

					for(i = 0; i < amount; i++){
						links[i] = document.createElement('a');

						links[i].href	 	= 'javascript:;';
						links[i].title	 	= 'Navegação';
						links[i].innerHTML 	= 'Navegação';
						links[i].className 	= 'bt-nav ir';

						data.controls.push(links[i]);
						container.appendChild(links[i]);
					};

					$(links).bind('click.drslider',function(){
						_private.movement.handlerButtonNav.call(this);
					});

					$.data($(this)[0], 'drSlider', data);

					data.$list.parent().after(container);
				}
			},
			movement 	:{
				handlerButtonNav 	: function(){
					console.log('Executei: handlerButtonNav;');
					var $slider 	= $(this).parent().parent(),
						data 		= $.data($slider[0],'drSlider'),
						index 		= $(this).index(),
						position 	= ((data.listItemsOpts.width*index)*-1);

					$(this).addClass('current').siblings().removeClass('current');

					_private.movement.animate.call($slider, position);
				},
				animate 			: function(step){
					console.log('Executei: animate;');
					var data 		= $.data($(this)[0],'drSlider');

					
				}
			}
		},

		methods 	= {
			init 		: function(options){
				console.log('Executei: init;');
				return this.each(function(){
					var $this 	= $(this),
						data 	= $.data($this[0], 'drSlider'),
						dataset	= function(attr, casting) {
							var ret = this.attr("data-drslider-" + attr);

							if (typeof ret 	=== "undefined") 	return undefined;
							if (casting 	=== "bool") 		return ((ret + "").toLowerCase() === "false") ? false : true;
							if (casting 	=== "int") 			return window.parseInt(ret, 10);
							if (casting 	=== "float") 		return window.parseFloat(ret);
							if (casting 	=== "string") 		return ret.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							
							return ret;
						},
						settings 	= {
							loop 		: dataset.call($this, 'loop', 'bool') 		=== true	 ? true : false,
							shownav 	: dataset.call($this, 'shownav', 'bool') 	=== true	 ? true : false,
							visible 	: dataset.call($this, 'visible', 'int') 				|| 4,
							walk 		: dataset.call($this, 'walk', 'int')	 				|| 3,
							easing 		: dataset.call($this, 'easing', 'string')				|| 'easeOutExpo'
						};

					options && $.extend(settings, options);

					if(!data){
						settings.$slider		= $(this),
						settings.$list			= settings.$slider.find('ul'),
						settings.$children		= settings.$list.children(),
						settings.controls 		= [],
						settings.listItemsOpts 	= {
							length 	: settings.$children.length,
							width 	: settings.$children.outerWidth(),
							height 	: settings.$children.outerHeight()
						};

						$.data($this[0], 'drSlider', settings);
					}
					
					_private.create.wrapList.call(this);
					settings.shownav && _private.create.createNavLinks.call(this);
				});
			},
			destroy 	: function(){
				console.log('Executei: destroy;');
				return this.each(function(){
					var data 		= $.data($(this)[0],'drSlider');

					data.$slider.removeAttr('style');
					data.$overflow.remove();

					$(data.controls).unbind('.drslider').remove();
				});
			}
		};

	$.fn.drSlider = function(method){
		if (methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method){
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.drSlider');
		}    
	};

})(jQuery);

(function($){

	$('#wrapper-slider').drSlider({
		shownav 	: true,
		visible 	: 1,
		walk 		: 1
	});

})(jQuery);