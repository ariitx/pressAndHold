/*
 * jQuery pressAndHold Plugin 1.0.0
 * https://github.com/santhony7/pressAndHold
 *
 * Copyright 2013, Tony Smith
 * https://www.naptown.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 * 
 * Modified by Ari
 */
;(function($, window, document, undefined) {

	var pressAndHold = "pressAndHold",
		defaults = {
			holdTime: 700,
			progressIndicatorRemoveDelay: 300,
			progressIndicatorColor: "#ff0000",
			progressIndicatorOpacity: 0.6,
			clickHoldRepeat: false,
			showIndicator: true,
		};

	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pressAndHold;
		this.init();
	}

	Plugin.prototype = {
		init: function() {
			var _this = this,
			timer,
			decaCounter,
			progressIndicatorHTML;

			$(this.element).css({
				display: 'block',
				overflow: 'hidden',
				position: 'relative'
			});

			progressIndicatorHTML = '<div class="holdButtonProgress" style="height: 100%; width: 100%; position: absolute; top: 0; left: -100%; background-color:' + this.settings.progressIndicatorColor + '; opacity:' + this.settings.progressIndicatorOpacity + ';"></div>';

			if (!this.settings.clickHoldRepeat) $(this.element).prepend(progressIndicatorHTML);

			$(this.element).mousedown(function(e) {
				var holdTime_clickHoldRepeat_minValue = 50;
				var temporaryHoldTime = _this.settings.holdTime;

				if(e.button != 2){
					$(_this.element).trigger('clickHoldRepeat.pressAndHold');
					$(_this.element).trigger('start.pressAndHold');
					decaCounter = 0;
					timer = setInterval(function() {
						decaCounter += 10;
						if (!_this.settings.clickHoldRepeat) $(_this.element).find(".holdButtonProgress").css("left", ((decaCounter / temporaryHoldTime) * 100 - 100) + "%");
						if (decaCounter == temporaryHoldTime) {
							if (!_this.settings.clickHoldRepeat) {
								_this.exitTimer(timer);
							}
							else {
								decaCounter = 0;
								if (temporaryHoldTime > holdTime_clickHoldRepeat_minValue){
									if (temporaryHoldTime - holdTime_clickHoldRepeat_minValue < holdTime_clickHoldRepeat_minValue){
										temporaryHoldTime = holdTime_clickHoldRepeat_minValue;
									}
									else{									
										temporaryHoldTime -= holdTime_clickHoldRepeat_minValue;
									}
								}
							}
							$(_this.element).trigger('clickHoldRepeat.pressAndHold');
							$(_this.element).trigger('complete.pressAndHold');
						}
					}, 10);

					$(_this.element).on('mouseup.pressAndHold mouseleave.pressAndHold', function(event) {
						_this.exitTimer(timer);
					});

				}
			});
		},
		exitTimer: function(timer) {
			var _this = this;
			clearTimeout(timer);
			$(this.element).off('mouseup.pressAndHold mouseleave.pressAndHold');
			setTimeout(function() {
				$(".holdButtonProgress").css("left", "-100%");
				$(_this.element).trigger('end.pressAndHold');
			}, this.settings.progressIndicatorRemoveDelay);
		}
	};

	$.fn[pressAndHold] = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + pressAndHold)) {
				$.data(this, "plugin_" + pressAndHold, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);
