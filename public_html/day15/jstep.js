/*global JStep, $_GET, $_REQUEST, $_COOKIE, window */

/** JStep library
 *
 *  This is a JavaScript library created by the authors of the textbook,
 *  Web Programming Step by Step.
 *  Its purpose is to add functionality to the JavaScript language and browser DOM,
 *  including several features to make JavaScript feel more similar to PHP.
 *  (For example, it adds $_GET, $_REQUEST, and $_COOKIE global arrays.)
 *
 *  This library is open source and free for all non-commercial use.
 *  All use must include attribution to the original author and the link to
 *  the original location where this script can be found and downloaded:
 *
 *  http://www.webstepbook.com/jstep.js
 *
 *  @version 1.2 (Wed Dec 05 2012)
 *  @author Marty Stepp (authors AT webstepbook DOT com)
 */
if (typeof(JStep) === "undefined") {
	if (typeof(window) === "undefined") {
		var window = this;
	}

	(function() {
		"use strict";

		/** A _JStep local symbol is used internally so client can't mess up functionality.
		 *  At end of script we will export this as a public global named JStep.
		 */
		var _JStep = function() {};
		_JStep.toString = function() { return "JStep JavaScript framework, by Marty Stepp"; };
		// (some _JStep global fields are set at the bottom of this script)


		/** Global _JStep functions */

		/**
		 * A shortcut for document.getElementById, similar to that used in Prototype
		 * and other JS frameworks.  There is no particular reason to use this $
		 * over the $ provided with those frameworks, if you are linking to both.
		 */
		_JStep.$ = function(id) {
			var element = id;
			if (typeof(id) == "string") {
				element = document.getElementById(id);
			} else if (typeof(id) == "number") {
				element = document.getElementById("" + id);
			}

			// allow for the possibility of Prototype
			if (typeof(Prototype) !== "undefined" &&
					typeof(Element) !== "undefined" &&
					typeof(Element.extend) === "function") {
				element = Element.extend(element);
			}

			return element;
		};

		/** Returns true if the given variable is defined and has a value. */
		_JStep.defined = function(variable) {
			return (!(!(variable || false)));
		};

		/**
		 * A fixed version of JavaScript's flawed typeof function.
		 * Now works properly on arrays and null values.
		 * Credit to Douglas Crockford for inspiration.
		 */
		_JStep.typeOf = function(value) {
			var s = typeof value;
			if (s === 'object') {
				if (value) {
					if (value instanceof Array) {
						s = 'array';
					}
				} else {
					s = 'null';
				}
			}
			return s;
		};


		/** Array class to store functions related to arrays. */
		_JStep.Array = function() {};

		/** Returns true if the given element is contained in the given array, or false if not found.
		Only works for arrays whose indexes are integers (not for hashes). */
		_JStep.Array.contains = function(array, element) {
			return _JStep.Array.indexOf(array, element) >= 0;
		};

		/** Returns a duplicate of the given array. */
		_JStep.Array.copy = function(array) {
			var newArray = [];
			for (var key in array) {
				if (typeof(key) === "number" || typeof(key) === "string") {
					newArray[key] = array[key];
				}
			}
			return newArray;
		};

		/** Returns first index of the given element in the given array (-1 if not found).
			Array object has this function in Firefox, but IE6 blows so I have to rewrite it. */
		_JStep.Array.indexOf = function(array, element) {
			for (var i = 0; i < array.length; i++) {
				if (array[i] == element) {
					return i;
				}
			}
			return -1;
		};

		/** Returns true if the given object is an array or is array-like. */
		_JStep.Array.isArray = function(a) {
			return a instanceof Array || a instanceof NodeList || (a.hasOwnProperty("length") && typeof(a["forEach"]) !== "undefined");
		};

		/** Removes element at given index from given array and slides others over. */
		_JStep.Array.remove = function(array, index) {
			if (typeof(index) !== "number") {
				return _JStep.Array.removeElement(array, index);
			}
			var result = array.slice(0, index).concat(array.slice(index + 1));
			return result;
		};

		/** Removes given element value from given array and slides others over. */
		_JStep.Array.removeElement = function(array, element) {
			return _JStep.Array.remove(array, _JStep.Array.indexOf(array, element));
		};

		/** Rearranges the contents of the given array into random order. */
		_JStep.Array.shuffle = function(array) {
			for (var i = 0; i < array.length - 1; i++) {
				var j = Math.floor(Math.random() * (array.length - i)) + i;
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
		};


		/** Browser class stores info related to the current web browser. */
		_JStep.Browser = function() {};

		/** Returns true if the current web browser is any version of IE. */
		_JStep.Browser.isIE = function() {
			return navigator.appName.match(/Internet Explorer/);
		};

		/** Returns true if the current web browser is MS IE 6 (God help us all). */
		_JStep.Browser.isIE6 = function() {
			return _JStep.Browser.isIE() && navigator.appVersion.match(/MSIE 6/);
		};

		/** Returns true if the current web browser is any version of Apple Safari. */
		_JStep.Browser.isSafari = function() {
			return navigator.userAgent.indexOf('AppleWebKit') >= 0;
		};


		/** Cookie utility class stores things related to cookies. */
		_JStep.Cookie = function() {};
		_JStep.Cookie.DEFAULT_EXPIRATION = 99;   // default of 99 days till cookie expires

		/** Returns true if a cookie exists with the given name. */
		_JStep.Cookie.defaultCookieName = function(id) {
			if (id) {
				return "JSTEP_COOKIE_" + id;
			} else {
				return null;  // error
			}
		};

		/** Returns true if a cookie exists with the given name. */
		_JStep.Cookie.exists = function(name) {
			return _JStep.Cookie.get(name) !== null;
		};

		/** Returns the value of the cookie with the given name (null if not found). */
		_JStep.Cookie.get = function(name) {
			name = name.replace(/[^a-zA-Z0-9_]+/, "");  // strip illegal chars

			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(nameEQ) == 0) {
					c = c.substring(nameEQ.length);
					c = c.replace(/_&SEMI_/, ";");
					c = c.replace(/_&EQUALS_/, "=");
					return c;
				}
			}
			return null;
		};

		/**
		 * Turns the given checkbox into one that will remember its checked-ness,
		 * using a client-side cookie with the given name.
		 */
		_JStep.Cookie.makeCheckboxStateful = function(element, cookieName, expiration) {
			element = _JStep.$(element);
			if (!element) {
				return;
			}
			if (!cookieName) {
				cookieName = _JStep.Cookie.defaultCookieName(element.id);
			}
			if (!cookieName) {
				return;
			}

			element.cookieName = cookieName;
			if (_JStep.Cookie.exists(cookieName) && !element.disabled) {
				var shouldBeChecked = (_JStep.Cookie.get(cookieName) == "true");
				if (element.checked != shouldBeChecked) {
					if (!element.disabled) {
						if (element.onclick) {
							element.onclick();
						}
						if (element.onchange) {
							element.onchange();
						}
						// element.simulate("change");
					}
					element.checked = shouldBeChecked;
				}
			}
			_JStep.Event.addEventListener(element, "change", function(event) {
				_JStep.Cookie.statefulCheckboxChange(element, cookieName, expiration);
			});
		};

		/**
		 * Turns the given radio into one that will remember its checked-ness,
		 * using a client-side cookie with the given name.
		 * Will also uncheck other radio buttons in the same name group.
		 */
		_JStep.Cookie.makeRadioButtonStateful = function(element, cookieName, expiration) {
			element = _JStep.$(element);
			if (!element) {
				return;
			}
			if (!cookieName) {
				cookieName = _JStep.Cookie.defaultCookieName(element.id);
			}
			if (!cookieName) {
				return;
			}

			element.cookieName = cookieName;
			if (_JStep.Cookie.exists(cookieName)) {
				var shouldBeChecked = (_JStep.Cookie.get(cookieName) == "true");
				if (element.checked != shouldBeChecked) {
					if (!element.disabled) {
						if (element.onclick) {
							element.onclick();
						}
						if (element.onchange) {
							element.onchange();
						}
						// element.simulate("change");
					}
					element.checked = shouldBeChecked;
				}
			}

			if (!element.disabled) {
				element.addEventListener("change", function(event) {
					_JStep.Cookie.statefulRadioButtonChange(element, cookieName, expiration);
				});
			}
		};

		/**
		 * Turns the given select box into one that will remember its selected value,
		 * using a client-side cookie with the given name.
		 */
		_JStep.Cookie.makeSelectStateful = function(element, cookieName, expiration) {
			element = _JStep.$(element);
			if (!element) {
				return;
			}
			if (!cookieName) {
				cookieName = _JStep.Cookie.defaultCookieName(element.id);
			}
			if (!cookieName) {
				return;
			}

			element.cookieName = cookieName;
			if (_JStep.Cookie.exists(cookieName)) {
				element.value = _JStep.Cookie.get(cookieName);
				if (!element.disabled) {
					if (element.onchange) {
						element.onchange();
					}
					// element.simulate("change");
				}
			}
			element.addEventListener("change", function(event) {
				_JStep.Cookie.statefulSelectChange(element, cookieName, expiration);
			});
		};

		/**
		 * Turns the given input text box into one that will remember its selected value,
		 * using a client-side cookie with the given name.
		 * Basically identical code to makeSelectStateful...
		 */
		_JStep.Cookie.makeTextBoxStateful = function(element, cookieName, expiration) {
			element = _JStep.$(element);
			if (!element) {
				return;
			}
			if (!cookieName) {
				cookieName = _JStep.Cookie.defaultCookieName(element.id);
			}
			if (!cookieName) {
				return;
			}

			element.cookieName = cookieName;
			if (_JStep.Cookie.exists(cookieName)) {
				element.value = _JStep.Cookie.get(cookieName);
				if (!element.disabled) {
					if (element.onchange) {
						element.onchange();
					}
					// element.simulate("change");
				}
			}
			element.addEventListener("change", function(event) {
				_JStep.Cookie.statefulSelectChange(element, cookieName, expiration);
			});
		};

		/** Returns the value of the cookie with the given name (null if not found). */
		_JStep.Cookie.parseAll = function() {
			var hash = {};

			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var crumbs = cookies[i].split("=");
				if (crumbs.length < 2) {
					continue;
				}
				hash[crumbs[0]] = crumbs[1].replace(/_&SEMI_/, ";").replace(/_&EQUALS_/, "=");
			}
			return hash;
		};

		/**
		 * Turns the given input text box into one that will remember its selected value,
		 * using a client-side cookie with the given name.
		 * Basically identical code to makeSelectStateful...
		 */
		_JStep.Cookie.remember = function(element, cookieName, expiration) {
			element = _JStep.$(element);
			if (!element || !element.tagName) {
				return false;
			}

			// figure out what kind of element it is
			if (element.tagName.toLowerCase() === "input") {
				if (!element.type || element.type == "text" || element.type == "password") {
					_JStep.Cookie.makeTextBoxStateful(element, cookieName, expiration);
				} else if (element.type == "checkbox") {
					_JStep.Cookie.makeCheckboxStateful(element, cookieName, expiration);
				} else if (element.type == "radio") {
					_JStep.Cookie.makeRadioButtonStateful(element, cookieName, expiration);
				} else {
					return false;
				}
			} else if (element.tagName.toLowerCase() === "select") {
				_JStep.Cookie.makeSelectStateful(element, cookieName, expiration);
			} else {
				return false;
			}
			return true;
		};

		/** Removes the cookie with the given name. */
		_JStep.Cookie.remove = function(name) {
			_JStep.Cookie.set(name, "", -1);
		};

		/**
		 * Sets the cookie with the given name to have the given value.
		 * Taken from http://www.quirksmode.org/js/cookies.html
		 */
		_JStep.Cookie.set = function(name, value, days) {
			name = name.replace(/[^a-zA-Z0-9_]+/, "");  // strip illegal chars
			value = value.replace(/;/, "_&SEMI_");	  // semicolon is the cookie delimiter; must escape

			if (days && days > 0) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				var expires = "; expires=" + date.toGMTString();
			} else if (days < 0) {
				var expires = "; expires=Thu, 01 Jan 1970 00:00:01 GMT";
			} else {
				var expires = "";
			}
			document.cookie = name + "=" + value + expires + "; path=/";
		};

		/**
		 * This function is called when a "stateful" checkbox's checked state
		 * changes, and stores that state in a cookie to be restored later.
		 */
		_JStep.Cookie.statefulCheckboxChange = function(element, cookieName, expiration) {
			element = _JStep.$(element);
			if (!element) {
				return;
			}
			if (!cookieName) {
				cookieName = _JStep.Cookie.defaultCookieName(element.id);
			}
			if (!cookieName) {
				return;
			}
			if (!expiration) {
				expiration = _JStep.Cookie.DEFAULT_EXPIRATION;
			}
			_JStep.Cookie.set(cookieName, element.checked ? "true" : "false", expiration);
		};

		/**
		 * This function is called when a "stateful" checkbox's checked state
		 * changes, and stores that state in a cookie to be restored later.
		 */
		_JStep.Cookie.statefulRadioButtonChange = function(element, cookieName) {
			element = _JStep.$(element);
			if (!element) {
				return;
			}
			if (!cookieName) {
				cookieName = _JStep.Cookie.defaultCookieName(element.id);
			}
			if (!cookieName) {
				return;
			}
			var radios = document.getElementsByName(element.name);
			for (var i = 0; i < radios.length; i++) {
				if (radios[i].cookieName) {
					_JStep.Cookie.set(radios[i].cookieName, "false");
				}
			}
			_JStep.Cookie.set(cookieName, element.checked ? "true" : "false");
		};

		/**
		 * This function is called when a "stateful" select box's selected element
		 * changes, and stores that value in a cookie to be restored later.
		 */
		_JStep.Cookie.statefulSelectChange = function(element, cookieName) {
			element = _JStep.$(element);
			if (!element) {
				return;
			}
			if (!cookieName) {
				cookieName = _JStep.Cookie.defaultCookieName(element.id);
			}
			if (!cookieName) {
				return;
			}
			_JStep.Cookie.set(cookieName, element.value);
		};


		/** DOM class stores functionality related to the browser HTML DOM. */
		_JStep.DOM = function() {};

		_JStep.DOM.disableLink = function(element) {
			if (element.disabled) {
				return element;
			}

			element.disabled = true;
			element.oldFG = _JStep.DOM.getStyle(element, "color");
			element.style.color = "#888";
			return element;
		};

		_JStep.DOM.enableLink = function(element) {
			if (!element.disabled) {
				return element;
			}

			element.disabled = false;
			element.style.color = "" + element.oldFG;
			return element;
		};

		/** Stolen from Prototype; gets current style of an element's given CSS property. */
		_JStep.DOM.getStyle = function(element, style) {
			if (!element) { return null; }
			var value = element.style[style == 'float' ? 'cssFloat' : style];
			if (!value || value == 'auto') {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					var css = document.defaultView.getComputedStyle(element, null);
					if (css) {
						if (css.getPropertyValue) {
							value = css.getPropertyValue(style);
						} else {
							value = css[style];
						}
					}
				}

				if (!value && window.getComputedStyle) {
					var css = window.getComputedStyle(element);
					if (css) {
						if (css.getPropertyValue) {
							value = css.getPropertyValue(style);
						} else {
							value = css[style];
						}
					}
				}

				if (!value && element.currentStyle) {
					value = element.currentStyle[style];
				}
			}
			if (style === 'opacity') {
				return value ? parseFloat(value) : 1.0;
			}
			return value == 'auto' ? null : value;
		};

		/** A cross-browser way to get text out of an element/control. */
		_JStep.DOM.getTextContent = function(element) {
			try {
				if (typeof(element.value) !== "undefined") {
					return element.value;
				} else if (typeof(element.textContent) !== "undefined") {
					return element.textContent;
				} else if (typeof(element.innerText) !== "undefined") {
					return element.innerText;
				} else if (typeof(element.firstChild) !== "undefined" && typeof(element.firstChild.nodeValue) !== "undefined") {
					return element.firstChild.nodeValue;
				}
			} catch (e) {}
			return null;
		};

		/**
		 * Returns true if the given element uses the given HTML tag, case-insensitive.
		 * If the tagName is empty or is "*", returns true.
		 */
		_JStep.DOM.isTagName = function(element, tagName) {
			if (!element) {
				return false;
			} else if (!tagName || tagName == "*") {
				return true;
			}

			var nodeName = element.nodeName.toLowerCase();
			if (tagName) { tagName = tagName.toLowerCase(); }
			return nodeName == tagName;
		};

		/** Returns true if the given element is currently being displayed. */
		_JStep.DOM.isVisible = function(element, type, assumeEmptyMeansInvisible) {
			if (!element) {
				return false;
			}
			if (!type) {
				type = (assumeEmptyMeansInvisible) ? "block" : "";
			}

			// var opacity0 = element.style.opacity === 0 || element.style.opacity === "0" || element.style.opacity === "0.0";
			var display = _JStep.DOM.getStyle(element, "display");
			var visibility = _JStep.DOM.getStyle(element, "visibility");
			var opacity = _JStep.DOM.getStyle(element, "opacity");

			var noneSet = !display && !visibility && !opacity;

			var hiddenByDisplay    = (assumeEmptyMeansInvisible && noneSet) || display == "none";
			var hiddenByVisibility = (assumeEmptyMeansInvisible && noneSet) || visibility == "hidden";
			var hiddenByOpacity    = (assumeEmptyMeansInvisible && noneSet) || (opacity === 0 || opacity === 0 || opacity === 0.0 || opacity === "0" || opacity === "0.0");

			return !hiddenByDisplay && !hiddenByVisibility && !hiddenByOpacity;
		};

		/** Kills all of the given DOM element's children. */
		_JStep.DOM.removeAllChildren = function(element) {
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}
		};

		/** Puts a cute tooltip on the given element. */
		_JStep.DOM.tooltip = function(element, tooltipText, autoHide, timeout) {
			if (!tooltipText) {
				if (!element.title) {
					return element;
				}
				tooltipText = "&nbsp;&nbsp;" + element.title + "&nbsp;&nbsp;";
			}

			var tooltip = document.createElement("span");
			tooltip.innerHTML = tooltipText;
			tooltip.className = "tooltip";

			var offset = typeof(element.cumulativeOffset) === "function" ? element.cumulativeOffset() : {left: 0, top: 0};
			tooltip.style.left = offset.left + 2 + "px";
			tooltip.style.top = offset.top + element.getHeight() + 2 + "px";

			element.parentNode.insertBefore(tooltip, element.nextSibling === undefined ? element : element.nextSibling);

			var hideTooltip = function() {
				// Scriptaculous/jQuery effect, if present
				if (typeof(tooltip.blindLeft) === "function") {
					tooltip.blindLeft();
				} else if (typeof(Effect) !== "undefined" && typeof(Effect.BlindLeft) !== "undefined") {
					new Effect.BlindLeft(tooltip);
				}
			};

			if (autoHide) {
				if (!timeout) {
					timeout = 2000;
				}
				setTimeout(hideTooltip, timeout);
			}

			return element;
		};


		/** Events class stores things related to event-handling. */
		_JStep.Event = function() {};
		_JStep.Event.KEY_RETURN = 13;
		_JStep.Event.KEY_TAB = 9;
		_JStep.Event.KEY_ESCAPE = 27;

		/** Stops an event from bubbling out (e.g. a form submission). */
		_JStep.Event.abort = function(event) {
			if (event) {
				if (typeof(event.stopPropagation) === "function") {
					event.stopPropagation();
				}
				if (typeof(event.preventDefault) === "function") {
					event.preventDefault();
				}
				if (typeof(event.cancelEvent) === "function") {
					event.cancelEvent();
				}
				event.cancelBubble = true;  // IE
			}
			return false;
		};

		/** A cross-browser event handler attaching function. */
		_JStep.Event.addEventListener = function(element, event, fn) {
			if (!element) {
				return;
			}
			if (element.addEventListener) {
				element.addEventListener(event, fn, false);
			} else if (element.attachEvent) {
				// IE (sucks)
				element.attachEvent("on" + event, fn);
			} else {
				element["on" + event] = fn;
			}
		};

		/**
		 * Calls the given function when the given link is clicked.
		 * Also sets the href of the link so that the cursor becomes a hand when hovering on it.
		 */
		_JStep.Event.addLinkListener = function(link, fn, setHref) {
			if (!link) {
				return;
			}
			if (typeof(link) === "string") {
				link = _JStep.$(link);
			}
			link.addEventListener("click", fn);
			if (!link.href && setHref !== false) {
				link.href = "#";   // so that the cursor will turn into a lil hand
			}
		};

		/** Attaches a window onload handler. */
		_JStep.Event.addOnLoad = function(fn) {
			if (document.observe) {
				// Prototype
				document.observe("dom:loaded", fn);
			} else {
				_JStep.Event.addEventListener(window, "load", fn);
			}
		};

		/** stops Enter keypress events. */
		_JStep.Event.cancelEnter = function(event) {
			event = _JStep.Event.standardize(event);
			var key = event.keyCode || event.which;
			if (key == 13) {  // user pressed Enter
				// don't let form submit
				return _JStep.Event.abort(event);
			}
		};

		/**
		 * Fires a fake event of the given type on the given element.
		 * @see https://developer.mozilla.org/en-US/docs/DOM/document.createEvent
		 */
		_JStep.Event.fire = function(element, eventName) {
			var eventMatchers = {
				'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
				'MouseEvents': /^(?:click|mouse(?:down|up|over|move|out))$/
			};
			var options = {
				clientX: 0,
				clientY: 0,
				pointerX: 0,
				pointerY: 0,
				button: 0,
				ctrlKey: false,
				altKey: false,
				shiftKey: false,
				metaKey: false,
				bubbles: true,
				cancelable: true
			};

			var oEvent, eventType = null;
			for (var name in eventMatchers) {
				if (eventMatchers[name].test(eventName)) {
					eventType = name;
					break;
				}
			}

			if (!eventType) {
				throw new SyntaxError("Only HTMLEvents and MouseEvents are supported");
			}

			if (document.createEvent) {
				oEvent = document.createEvent(eventType);
				if (eventType === "HTMLEvents") {
					oEvent.initEvent(eventName, options.bubbles, options.cancelable);
				}
				else {
					oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
						options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
						options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
				}
				element.dispatchEvent(oEvent);
			} else {
				options.clientX = options.pointerX;
				options.clientY = options.pointerY;
				oEvent = document.createEventObject();
				for (var option in options) {
					if (options.hasOwnProperty(option)) {
						oEvent[option] = options[option];
					}
				}
				element.fireEvent('on' + eventName, oEvent);
			}
		};

		/** Repairs various browser event incompatibilities on the given event. */
		_JStep.Event.standardize = function(event) {
			event = event || window.event;
			if (!event) {
				return event;
			}

			var keyCode = undefined;
			try {
				var keyCode = event.keyCode;
			} catch (ex) {
				try {
					var keyCode = event.which;
				} catch (ex2) {
					keyCode = -1;
				}
			}


			try {
				event.abort = function() {
					this.stopped = true;
					try {
						if (typeof(this.preventDefault) === "function") {
							this.preventDefault();
						}
					} catch (ex) {}

					try {
						if (typeof(this.stopPropagation) === "function") {
							this.stopPropagation();
						}
					} catch (ex) {}

					try {
						// if (this.stop && this.stop !== this.abort) {
						// 	this.stop();
						// }
					} catch (ex) {}

					this.cancelBubble = true;  // IE6
					return false;
				};
				if (!event.stop) {
					event.stop = event.abort;
				}

				event.KEY_RETURN = 13;
				event.KEY_ENTER = 13;
				event.KEY_TAB = 9;
				event.KEY_ESCAPE = 27;

				event.which = keyCode;
				event.keyCode = keyCode;
			} catch (e) {}

			try {
				if (typeof(event.srcElement) === "undefined") {
					event.srcElement = event.target;
				}
			} catch (ex) {}

			try {
				if (typeof(event.which) === "undefined") {
					event.which = event.button || event.which;
				} else if (typeof(event.button) === "undefined") {
					event.button = event.which || event.button;
				}
			} catch (ex) {}

			return event;
		};


		/** Form class has code related to input forms on a page. */
		_JStep.Form = function() {};

		/** Returns an array of all input controls inside a form. */
		_JStep.Form.getInputs = function(form, nameOnly, tagsToExclude) {
			var result = [];
			var kids = form.getElementsByTagName("*");
			for (var i = 0; i < kids.length; i++) {
				var kid = kids[i];
				if (!_JStep.DOM.isTagName(kid, "input") &&
						!_JStep.DOM.isTagName(kid, "textarea") &&
						!_JStep.DOM.isTagName(kid, "select")) {
					continue;
				}

				if (tagsToExclude &&
						_JStep.Array.contains(tagsToExclude, kid.tagName)) {
					continue;
				}

				if (!nameOnly || kid.name) {
					result.push(kid);
				}
			}

			return result;
		};

		/** Returns all query parameters within the given form. */
		_JStep.Form.queryParams = function(form) {
			var queryParams = [];
			var currentQueryString = _JStep.Page.queryParams();
			var kids = _JStep.Form.getInputs(form, true);
			for (var i = 0; i < kids.length; i++) {
				var kid = kids[i];
				if (_JStep.DOM.isTagName(kid, "input") && kid.type == "radio" && !kid.checked) {
					// special case: input type="radio"
					if (!queryParams[encodeURIComponent(kid.name)]) {
						// if this parameter's value is empty, just fill it in with "" as a placeholder
						queryParams[encodeURIComponent(kid.name)] = "";
					}
				} else if (_JStep.DOM.isTagName(kid, "input") && kid.type == "checkbox" && !kid.checked) {
					// special case: input type="checkbox"
					// if unchecked, shouldn't be included in parameters submitted
				} else {
					queryParams[encodeURIComponent(kid.name)] = encodeURIComponent(kid.value);
				}
			}

			return queryParams;
		};

		/**
		 * Dynamically creates and POSTs a new form to the given action URL with
		 * the given [name -> value] hash of query parameters.
		 * Optional 3rd param, if truthy, uses GET instead of POST.
		 */
		_JStep.Form.createAndPost = function(url, queryParams, boolGetVsPost) {
			if (!queryParams) {
				queryParams = _JStep.Page.getQueryString();
			}

			var form = document.createElement("form");
			form.action = url;
			form.method = boolGetVsPost ? "get" : "post";

			for (var key in queryParams) {
				if (typeof(key) === "string") {
					var input = document.createElement("input");
					input.type = "hidden";
					input.name = key;
					input.value = queryParams[key];
					form.appendChild(input);
				}
			}

			document.body.appendChild(form);
			form.submit();
		};

		_JStep.Form.setEnabled = function(form, enabled, tagsToExclude) {
			var kids = _JStep.Form.getInputs(form, false, tagsToExclude);
			for (var i = 0; i < kids.length; i++) {
				var kid = kids[i];
				kid.disabled = !enabled;
			}
		};


		/** Functions related to all objects in general. */
		_JStep.Object = function() {};

		/**
		 * A clone of an object is an empty object
		 * with a prototype reference to the original.
		 */
		_JStep.Object.clone = function(obj) {
			// a private constructor, used only by this one clone.
			function Clone() {}
			Clone.prototype = obj;
			return new Clone();
		};

		/**
		 * Removes all properties from the given object.
		 * Skips function properties (methods) unless 2nd parameter is truthy.
		 */
		_JStep.Object.clearOut = function(obj, includeFunctions) {
			for (var propertyName in obj) {
				if (!includeFunctions || typeof(obj[propertyName]) !== "function") {
					try {
						obj[propertyName] = undefined;
						// delete obj[propertyName];
					} catch (ex) {}
				}
			}
		};

		/**
		 * Creates and returns a "deep copy" of the given object.
		 * You can optionally bound how deep to copy with the levels parameter.
		 */
		_JStep.Object.deepCopy = function(obj, copy, levels) {
			if (typeof(obj) !== "object" || !obj || levels == 1) {
				return obj;
			} else {
				if (!copy) {
					if (_JStep.typeOf(obj) == "array") {
						copy = [];
					} else {
						// empty object
						copy = {};
					}
				}
				for (var propertyName in obj) {
					if (propertyName) {  // to appease JSLint
						try {
							// recursively deep-copy each property of this object
							if (obj[propertyName] !== undefined) {
								if (typeof(obj[propertyName]) !== "object" || !obj || levels == 2) {
									copy[propertyName] = obj[propertyName];
								} else {
									copy[propertyName] = _JStep.Object.deepCopy(obj[propertyName], undefined, levels - 1);
								}
							}
						} catch (ex) {}
					}
				}

				// special case for array length
				// if (typeOf(obj) == "array") {
				//  copy.length = obj.length;
				// }

				return copy;
			}
		};

		_JStep.Object.dump = function(obj, verbose) {
			var text = "";
			if (obj === undefined) {
				text = "undefined";
			} else if (obj === null) {
				text = "null";
			} else if (typeof (obj) === "string") {
				var LINE_SEPARATOR = "\n";
				var LINE_SEPARATOR_OUTPUT = "\n";

				var result = "string(length=" + obj.length + "): " + LINE_SEPARATOR_OUTPUT + "\"";
				for ( var i = 0; i < Math.min(10000, obj.length); i++) {
					var c = obj.charAt(i).toPrintableChar();
					result += c;
					if (obj.charAt(i) == "\n") {
						result += LINE_SEPARATOR_OUTPUT;
					}
				}
				result += "\"";
				if (verbose) {
					// display details about each index and character
					for ( var i = 0; i < Math.min(10000, obj.length); i++) {
						if (i % 5 == 0) {
							result += LINE_SEPARATOR_OUTPUT;
						}
						result += "  " + ("" + i).padL(3) + ": " +
								obj.charAt(i).toPrintableChar().padL(2) + " (" +
								("" + obj.charCodeAt(i)).padL(3) + ")   ";
					}
				}
				return result;
			} else if (typeof (obj) !== "object") {
				return typeof (obj) + ": " + obj;
			} else {
				text = "object {";
				var props = [];
				try {
					for (var prop in obj) {
						if (prop) {
							props.push(prop);
						}
					}
				} catch (e) {
					// IE can't enumerate the properties of some objects e.g. XML DOM nodes
					text += _JStep.Object.dump(e, verbose);
				}

				props.sort();

				// add each property's name and value to the string
				for ( var i = 0; i < props.length; i++) {
					var prop = props[i];
					try {
						if (prop == prop.toUpperCase()) {
							continue;
						} // skips constants; dom objs have lots of them
						text += LINE_SEPARATOR + "  " + prop + "=";
						if (prop.match(/innerHTML/)) {
							text += "[inner HTML, omitted]";
						} else if (obj[prop] && ("" + obj[prop]).match(/function/)) {
							text += "[function]";
						} else {
							text += obj[prop];
						}
					} catch (e) {
						text += "error accessing property '" + prop + "': " + e + LINE_SEPARATOR;
					}
				}

				if (text.charAt(text.length - 1) != "{") {
					text += LINE_SEPARATOR;
				}
				text += "}";
			}
			return text;
		};

		/** Creates and returns a "shallow copy" of the given object. */
		_JStep.Object.shallowCopy = function(obj, copy) {
			if (typeof(obj) !== "object") {
				return obj;
			} else {
				if (!copy) {
					copy = {};
				}
				for (var propertyName in obj) {
					if (propertyName) {  // to appease JSLint
						try {
							// recursively deep-copy each property of this object
							copy[propertyName] = obj[propertyName];
						} catch (ex) {}
					}
				}

				// special case for array length
				if (_JStep.typeOf(obj) == "array") {
					copy.length = obj.length;
				}

				return copy;
			}
		};

		/**
		 * Returns a string of keys like "{43px, 37px}" for obj {43px: true, 37px: "hi"}.
		 */
		_JStep.Object.toKeyString = function(obj) {
			if (typeof(obj) === "undefined") { return "undefined"; }
			if (obj === null) { return "null"; }
			if (typeof(obj) !== "object") { return typeof(obj) + ": " + obj; }

			var str = "";
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					str += (str.length > 0 ? ", " : "") + prop;
				}
			}

			return "{" + str + "}";
		};


		/** Page class contains features related to the current web page. */
		_JStep.Page = function() {};

		/**
		 * Converts a hash of [key -> value] query parameters into a url of form:
		 * key1=value1&key2=value2&...
		 */
		_JStep.Page.buildQueryString = function(queryParams) {
			if (!queryParams) {
				queryParams = _JStep.Page.queryParams();
			}
			var url = "";
			var first = true;
			for (var key in queryParams) {
				if (typeof(key) === "string") {
					url += (first ? "" : "&") + key + "=" + queryParams[key];
					first = false;
				}
			}
			return url;
		};

		/**
		 * Loads a .js file from a remote URL into this page.-
		 * If immediately is true, must be called before page is done loading.
		 */
		_JStep.Page.loadScript = function(url, immediately) {
			if (immediately && typeof(document['write']) === "function") {
				document['write']("<script src=\"" + url + "\" type=\"text/javascript\"></script>\n");
			} else {
				var scriptTag = document.createElement("script");
				scriptTag.type="text/javascript";
				scriptTag.src = url;
				document.body.appendChild(scriptTag);
			}
		};

		/** Takes an element with an event handler and makes it so the browser puts the "hand" cursor over it. */
		_JStep.Page.makeLinkIntoButton = function(linkElement, fn) {
			if (!linkElement || !fn) {
				return;
			}
			if (!linkElement.href) {
				linkElement.href = "#";  // so we get the "hand" cursor when hovering
			}
			_JStep.Event.addEventListener("click", fn);
		};

		/**
		 * Returns the page's query string as a hash.
		 * hash["name"] -> value of 'name' query param
		 */
		_JStep.Page.queryParams = function() {
			var hash = {};

			if (location.search && location.search.length >= 1) {
				var url = location.search.substring(1);
				var chunks = url.split(/&/);
				for (var i = 0; i < chunks.length; i++) {
					var keyValue = chunks[i].split("=");
					if (keyValue[0] && keyValue[1]) {
						var thisValue = unescape(keyValue[1]);
						thisValue = thisValue.replace(/[+]/g, " ");  // unescape URL spaces
						hash[keyValue[0]] = thisValue;
					}
				}
			}
			return hash;
		};

		/**
		 * Adds a randomized query parameter to the given URL so that the browser
		 * won't try to cache the page.
		 */
		_JStep.Page.toUncacheableURL = function(url) {
			if (!url) {
				url = location.href;
			}

			var randomNumber = new Date().getTime() + "" + Math.floor(Math.random() * 1000000000);
			url = url.replace(/[?&]dontcacheme=[0-9]+/, "");
			url += (url.indexOf("?") >= 0 ? "&" : "?") + "dontcacheme=" + randomNumber;
			return url;
		};


		/** Test class contains features related to unit testing JavaScript code. */
		_JStep.Test = function() {};

		/**
		 * Functions that should be called when assertions pass or fail.
		 * Default version of these functions sets page background to green or red.
		 * The client should set these functions if they want other behavior.
		 */
		_JStep.Test.pass = function(message) {
			if (console && console.log) { console.log("JStep assertion passed: " + message); }
		};

		_JStep.Test.failText = "";
		_JStep.Test.fail = function(message, errorFunc, immediately) {
			if (console && console.log) { console.log("JStep assertion FAILED: " + message); }
			_JStep.Test.failText += (_JStep.Test.failText ? "\n" : "") + message;
			if (immediately) {
				_JStep.Test.showResults(errorFunc);
			}
		};

		_JStep.Test.showResults = function(errorFunc) {
			if (_JStep.Test.failText) {
				// show "fail" red background and alert failure text
				document.body.style.backgroundImage = null;
				document.body.style.backgroundColor = "#f88";
				document.body.className += " fail";

				if (typeof(errorFunc) !== "function") {
					errorFunc = function(msg) {
						var msgWithLineBreaks = msg.replace(/, expected/g, ",\nexpected");
						window.alert(msgWithLineBreaks);
						throw new Error(msg);
					};
				}

				var msg = _JStep.Test.failText;
				_JStep.Test.failText = "";
				errorFunc(msg);
				return false;
			} else {
				// show "pass" green background
				if (!document.body.className.match(/fail/)) {
					document.body.style.backgroundImage = null;
					document.body.style.backgroundColor = "#bfb";
				}
				return true;
			}
		};

		/**
		 * xUnit-like assert function to test whether a specific value is true.
		 * Calls the given errorFunc (or alerts) if it is not.
		 */
		_JStep.Test.assert = _JStep.Test.assertTrue = function(condition, message, errorFunc) {
			if (condition) {
				_JStep.Test.pass(message);
			} else {
				_JStep.Test.fail(message, errorFunc);
			}
		};

		/**
		 * Asserts whether the two given values are equal to each other.
		 * If not, fails.
		 */
		_JStep.Test.assertEquals = function(expected, actual, message) {
			_JStep.Test.assert(expected == actual, message + ", expected '" + expected + "', found '" + actual + "'");
		};

		/**
		 * Asserts whether the given HTML DOM nodes all have the given attribute name set to
		 * the given expected value(s).
		 */
		_JStep.Test.assertAttribute = function(domNodes, attr, expectedValue, message) {
			if (_JStep.Array.isArray(domNodes)) {
				_JStep.Test.assert(domNodes.length > 0, "page should have one of the given element" + message);
			} else {
				// a single DOM node; put into array to simplify code
				domNodes = [domNodes];
			}
			if (!_JStep.Array.isArray(attr)) {
				attr = [attr];
			}
			if (!_JStep.Array.isArray(expectedValue)) {
				expectedValue = [expectedValue];
			}

			while (expectedValue.length < domNodes.length) {
				expectedValue.push(expectedValue[expectedValue.length - 1]);
			}

			// a list of DOM nodes, as returned by $$; process each
			for (var i = 0; i < domNodes.length; i++) {
				var nodeValue = null;
				if (domNodes[i]) {
					nodeValue = domNodes[i][attr];
					if (typeof(nodeValue) === "string") {
						nodeValue = nodeValue.trim();
					}
				}
				var expected = expectedValue[i];
				var nodeNameText = "'" + domNodes[i].tagName.toLowerCase() + "'" + (domNodes.length > 1 ? " #" + (i+1) : "");
				if (typeof(expected) === "object") {
					// a hash of allowed values; see if any are equal
					_JStep.Test.assertTrue(expected[nodeValue], message + " attribute '" + attr + "' on " + nodeNameText + " must be one of: " + _JStep.Object.toKeyString(expected) + " (found " + nodeValue + ")");
				} else {
					// just a simple allowed value; assert equal
					_JStep.Test.assertEquals(expectedValue[i], nodeValue, message + " attribute '" + attr + "' on " + nodeNameText);
				}
			}
		};

		/**
		 * Asserts whether the given HTML DOM nodes all have the given style property set to
		 * the given expected value(s).
		 */
		_JStep.Test.assertStyle = function(domNodes, prop, expectedValue, message) {
			if (message) {
				message = message + ": ";
			} else {
				message = "";  // null/undefined -> ""
			}
			if (_JStep.Array.isArray(domNodes)) {
				_JStep.Test.assert(domNodes.length > 0, "page should have one of the given element" + message);
			} else {
				// a single DOM node; put into array to simplify code
				domNodes = [domNodes];
			}
			if (!_JStep.Array.isArray(prop)) {
				prop = [prop];
			}

			if (!_JStep.Array.isArray(expectedValue)) {
				expectedValue = [expectedValue];
			}

			while (prop.length < expectedValue.length) {
				prop.push(prop[0]);
			}
			while (expectedValue.length < prop.length) {
				expectedValue.push(expectedValue[0]);
			}

			// a list of DOM nodes, as returned by $$; process each
			for (var i = 0; i < domNodes.length; i++) {
				for (var j = 0; j < prop.length; j++) {
					var nodeValue = null;
					if (domNodes[i]) {
						nodeValue = _JStep.DOM.getStyle(domNodes[i], prop[j]);
						if (nodeValue && nodeValue.match(/px$/)) {
							nodeValue = Math.round(parseFloat(nodeValue)) + "px";   // 18.667px -> 19px
						}
					}

					var expected = expectedValue[j];
					var nodeNameText = "'" + domNodes[i].tagName.toLowerCase() + "'" + (domNodes.length > 1 ? " #" + (i+1) : "");
					if (typeof(expected) === "object") {
						// a hash of allowed values; see if any are equal
						_JStep.Test.assertTrue(expected[nodeValue], message + "style '" + prop[j] + "' on " + nodeNameText + " must be one of: " + _JStep.Object.toKeyString(expected) + " (found " + nodeValue + ")");
					} else {
						// just a simple allowed value; assert equal
						_JStep.Test.assertEquals(expectedValue[j], nodeValue, message + "style '" + prop[j] + "' on " + nodeNameText);
					}
				}
			}
		};


		/** The following are utility functions to be added to String objects. */
		if (typeof(String.prototype.htmlDecode) !== "function") {
			/** Returns an HTML-decoded version of the given string. */
			String.prototype.htmlDecode = String.prototype.htmlSpecialCharsDecode = function() {
				var str = this;
				str = str.replace(/&amp;/gi, "&");
				str = str.replace(/&lt;/gi, "<");
				str = str.replace(/&gt;/gi, ">");
				str = str.replace(/&nbsp;/gi, " ");
				str = str.replace(/&quot;/gi, "\"");
				str = str.replace(/\u00A0/gi, " "); // stupid non-breaking space character on Safari
				str = str.replace(/\r\n/gi, "\n"); // stupid line breaks in IE/Opera
				return str;
			};
		}

		if (typeof(String.prototype.htmlEncode) !== "function") {
			/** Returns an HTML-encoded version of the given string.
			 *  Not very good; just gets the major stuff like < > "
			 */
			String.prototype.htmlEncode = String.prototype.htmlSpecialChars = function(skipSpaces) {
				var str = this;
				str = str.replace(/&/g, "&amp;");
				str = str.replace(/</g, "&lt;");
				str = str.replace(/>/g, "&gt;");
				if (!skipSpaces) {
					str = str.replace(/ /g, "&nbsp;");
				}
				str = str.replace(/\"/g, "&quot;");
				return str;
			};
		}

		if (typeof(String.prototype.padL) !== "function") {
			/** Inserts spaces at the front of the given string until it reaches the given length,
			 *  then returns the padded string.
			 */
			String.prototype.padL = function(length, nbsp) {
				var pad = "";
				while (this.length + pad.length < length) {
					pad += nbsp ? "&nbsp;" : " ";
				}
				return pad + this;
			};
		}

		if (typeof(String.prototype.padR) !== "function") {
			/** Inserts spaces at the front of the given string until it reaches the given length,
			 *  then returns the padded string.
			 */
			String.prototype.padR = function(length, nbsp) {
				var pad = "";
				while (this.length + pad.length < length) {
					pad += nbsp ? "&nbsp;" : " ";
				}
				return this + pad;
			};
		}

		if (typeof(String.prototype.trim) !== "function") {
			/** Deletes whitespace from the front and end of the given string. */
			String.prototype.trim = function() {
				return this.trimL().trimR();
			};
		}

		if (typeof(String.prototype.trimL) !== "function") {
			/** Deletes whitespace from the front of the given string. */
			String.prototype.trimL = function() {
				for (var k = 0; k < this.length && this.charAt(k) <= " "; k++) {
				}
				return this.substring(k, this.length);
			};
		}

		if (typeof(String.prototype.trimR) !== "function") {
			/** Deletes whitespace from the end of the given string. */
			String.prototype.trimR = function() {
				for ( var j = this.length - 1; j >= 0 && this.charAt(j) <= " "; j--) {
				}
				return this.substring(0, j + 1);
			};
		}

		if (typeof(String.prototype.toPrintableChar) !== "function") {
			/** Converts escape sequences into visible characters. */
			String.prototype.toPrintableChar = function() {
				if (this == "\n") {
					return "\\n";
				} else if (this == "\r") {
					return "\\r";
				} else if (this == "\t") {
					return "\\t";
				} else if (this == " " && _JStep.Browser.isIE()) {
					return "&nbsp;";
				} else {
					return this;
				}
			};
		}

		_JStep.$_REQUEST = _JStep.Page.queryParams();
		_JStep.$_COOKIE = _JStep.Cookie.parseAll();

		// deferred exporting of JStep globals until all internals are declared
		window.JStep = _JStep;
		window.$_GET = window.$_REQUEST = _JStep.$_REQUEST;
		window.$_COOKIE = _JStep.$_COOKIE;
	})();
}