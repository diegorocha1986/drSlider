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
						links[i].innerHTML 	= (i+1);
						links[i].className 	= 'bt-nav';

						container.appendChild(links[i]);
					};

					$(links).first().addClass('active');

					data.controls.nav = links;
					
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

					$(this).addClass('active').siblings().removeClass('active');

					_private.movement.animate.call($slider, position);
				},
				animate 			: function(step){
					console.log('Executei: animate;');
					var data 		= $.data($(this)[0],'drSlider');

					data.$overflow.animate({
						left		: step
					},{
						duration	: data.animation.duration,
						easing 		: data.animation.easing,
						step 		: data.animation.onAnimate,
						complete 	: data.animation.onEnd
					});
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
							animation 	: {
								easing 		: dataset.call($this, 'easing', 'string')				|| 'easeOutExpo',
								duration 	: dataset.call($this, 'duration', 'int')				|| 700,
								onStart 	: null,
								onAnimate 	: null,
								onEnd 		: null
							}
						};

					options && $.extend(settings, options);

					if(!data){
						settings.$slider		= $(this),
						settings.$list			= settings.$slider.find('ul'),
						settings.$children		= settings.$list.children(),
						settings.controls 		= {},
						settings.listItemsOpts 	= {
							length 	: settings.$children.length,
							width 	: settings.$children.outerWidth(),
							height 	: settings.$children.outerHeight()
						};

						$.data($this[0], 'drSlider', settings);
					}
					
					_private.create.wrapList.call(this);

					if(settings.shownav){
						if(typeof settings.shownav === 'boolean' && settings.shownav === true){
							_private.create.createNavLinks.call(this);
							_private.create.createArrowControls.call(this);
						}
						(settings.shownav === 'arrows') && _private.create.createArrowControls.call(this);
						(settings.shownav === 'nav')    && _private.create.createNavLinks.call(this);
					}

					console.log($.data($this[0], 'drSlider'));
				});
			},
			destroy 	: function(){
				console.log('Executei: destroy;');
				return this.each(function(){
					var data 		= $.data($(this)[0],'drSlider');

					data.$slider.removeAttr('style');
					data.$list.unwrap();

					$(data.controls).unbind('.drslider').remove();

					$.removeData(this, 'drSlider');
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