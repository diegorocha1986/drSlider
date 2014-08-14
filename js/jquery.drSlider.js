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
				wrapList 				: function(){
					console.log('Executei: create/wrapList;');
					var data 		= this;

					data.$slider.css({
						width 		: data.listItemsOpts.width,
						overflow 	: 'hidden',
						position 	: 'relative'
					});

					data.$list.wrap('<div class="drslider-overflow" />');
					data.$overflow = data.$list.parent();
					
					data.$overflow.css({
						width 		: (data.listItemsOpts.width * data.listItemsOpts.length),
						position 	: 'relative'
					});
				},
				createNavLinks 			: function(){
					console.log('Executei: create/createNavLinks;');
					var data 		= this,
						container 	= document.createElement('p'),
						amount 		= Math.ceil(data.listItemsOpts.length/data.visible),
						links 		= [],
						i;

					container.className 	= 'drslider-container-nav';

					for(i = 0; i < amount; i++){
						links[i] = document.createElement('a');

						links[i].href	 	= 'javascript:;';
						links[i].title	 	= 'Navegação';
						links[i].innerHTML 	= (i+1);
						links[i].className 	= 'drslider-bt-nav';

						container.appendChild(links[i]);
					};

					$(links).first().addClass('active');

					data.controls.nav = links;
					
					$(links).bind('click.drslider',function(){
						_private.movement.handlerButtonNav.call(data, this);
					});

					data.$list.parent().after(container);
				},
				createArrowControls 	: function(){
					console.log('Executei: create/createArrowControls;');
					var data 		= this,
						next		= document.createElement('button'),
						previous	= document.createElement('button'),
						controls 	= {};

					next.className = 'drslider-next';
					next.innerHTML = '>';
					$(next).bind('click.drslider',function(){
						_private.movement.next.call(data);
					});

					previous.className = 'drslider-previous';
					previous.innerHTML = '<';
					$(previous).bind('click.drslider',function(){
						_private.movement.previous.call(data);
					});

					controls = {
						next 		: next,
						previous 	: previous
					};

					data.controls.arrows = controls;

					data.$overflow.before(controls.previous).after(controls.next);
				}
			},
			movement 	: {
				handlerButtonNav 		: function(elm){
					console.log('Executei: movement/handlerButtonNav;');
					var data 		= this,
						index 		= $(elm).index(),
						indexLi		= (index * data.visible),
						position 	= ((data.$children.eq(indexLi).position().left) * -1);

					$(elm).addClass('active').siblings().removeClass('active');

					data.current = index;

					_private.movement.animate.call(data, position);
				},
				previous 				: function(){
					console.log('Executei: movement/previous;');
					var data = this;

					
				},
				next 					: function(){
					console.log('Executei: movement/next;');
					var data = this;

					console.log(data.current);	
				},
				animate 				: function(step){
					console.log('Executei: movement/animate;');
					var data = this;

					data.animating = true;

					data.$overflow.not(':animated').animate({
						left		: step
					},{
						duration	: data.animation.duration,
						easing 		: data.animation.easing,
						step 		: data.animation.onAnimate,
						complete 	: function(){
							data.animating = false;

							(typeof data.animation.onEnd === 'function') && data.animation.onEnd.call(data.$slider[0]);
						}
					});
				}
			},
			interval 	: {
				create 					: function(){
					console.log('Executei: interval/create;');
					var data = this;

					if(!data.interval || data.interval === 0)
						return;

					return window.setInterval(function(){
						methods.next.call(data);
					}, data.interval);
				},
				clear 					: function(){
					console.log('Executei: interval/clear;');
					var data = this;

					
				}
			}
		},

		methods 	= {
			init 		: function(options){
				console.log('Executei: methods/init;');
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
							interval 	: 3000,
							animating 	: false,
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
						settings.current 		= 0,
						settings.controls 		= {},
						settings.listItemsOpts 	= {
							length 	: settings.$children.length,
							width 	: settings.$children.outerWidth(),
							height 	: settings.$children.outerHeight()
						};

						$.data($this[0], 'drSlider', settings);
					}
					
					_private.create.wrapList.call(settings);

					if(settings.shownav){
						if(typeof settings.shownav === 'boolean' && settings.shownav === true){
							_private.create.createNavLinks.call(settings);
							_private.create.createArrowControls.call(settings);
						}
						(settings.shownav === 'arrows') && _private.create.createArrowControls.call(settings);
						(settings.shownav === 'nav')    && _private.create.createNavLinks.call(settings);
					}
				});
			},
			destroy 	: function(){
				console.log('Executei: methods/destroy;');
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