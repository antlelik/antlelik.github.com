// DOMContentLoaded function
(function( window ) {
	"use strict";

	// Define a local copy of $
	var $ = function( callback ) {
			registerOrRunCallback( callback );
			bindReady();
		},
		// Use the correct document accordingly with window argument (sandbox)
		document = window.document,
		readyBound = false,
		callbackQueue = [],
		registerOrRunCallback = function( callback ) {
			if ( typeof callback === "function" ) {
				callbackQueue.push(callback);
			}
		},
		DOMReadyCallback = function() {
			while( callbackQueue.length ) {
				(callbackQueue.shift())();
			}
			registerOrRunCallback = function( callback ) {
				callback();
			};
		},

		// The ready event handler
		DOMContentLoaded = function() {
			if ( document.addEventListener ) {
					document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			} else {
					// we're here because readyState !== "loading" in oldIE
					// which is good enough for us to call the dom ready!
					document.detachEvent( "onreadystatechange", DOMContentLoaded );
			}
			DOMReady();
		},

		// Handle when the DOM is ready
		DOMReady = function() {
			// Make sure that the DOM is not already loaded
			if ( !$.isReady ) {
				// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
				if ( !document.body ) {
					return setTimeout( DOMReady, 1 );
				}
				// Remember that the DOM is ready
				$.isReady = true;
				// If there are functions bound, to execute
				DOMReadyCallback();
				// Execute all of them
			}
		}, // /ready()

		bindReady = function() {
			var toplevel = false;

			if ( readyBound ) {
				return;
			}
			readyBound = true;

			// Catch cases where $ is called after the
			// browser event has already occurred.
			if ( document.readyState !== "loading" ) {
				DOMReady();
			}

			// Mozilla, Opera and webkit nightlies currently support this event
			if ( document.addEventListener ) {
				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
				// A fallback to window.onload, that will always work
				window.addEventListener( "load", DOMContentLoaded, false );
				// If IE event model is used
			} else if ( document.attachEvent ) {
				// ensure firing before onload,
				// maybe late but safe also for iframes
				document.attachEvent( "onreadystatechange", DOMContentLoaded );
				// A fallback to window.onload, that will always work
				window.attachEvent( "onload", DOMContentLoaded );
				// If IE and not a frame
				// continually check to see if the document is ready
				try {
					toplevel = window.frameElement == null;
				} catch (e) {}
				if ( document.documentElement.doScroll && toplevel ) {
					doScrollCheck();
				}
			}
		},

		// The DOM ready check for Internet Explorer
		doScrollCheck = function() {
			if ( $.isReady ) {
				return;
			}
			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch ( error ) {
				setTimeout( doScrollCheck, 1 );
				return;
			}
			// and execute any waiting functions
			DOMReady();
		};

	// Is the DOM ready to be used? Set to true once it occurs.
	$.isReady = false;

	// Expose $ to the global object
	window.$ = $;

})( window );

// init caclulation
$(function(){
	window.calc = Calculation;
	window.calc1 = new calc('.calc-section');
});


function isNumeric (n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// Class Calculation
function Calculation(node) {
	this.holderNode = document.querySelector('.calc-section');
	this.resultArea = this.holderNode.querySelector('.result');
	this.sumNode = this.holderNode.querySelector('.sum');
	this.subNode = this.holderNode.querySelector('.sub');
	this.mulNode = this.holderNode.querySelector('.mul');
	this.divNode = this.holderNode.querySelector('.div');
	this.modNode = this.holderNode.querySelector('.mod');
	this.resetNode = this.holderNode.querySelector('.reset');
	this.operator1 = this.holderNode.querySelector('.number-area-1');
	this.operator2 = this.holderNode.querySelector('.number-area-2');
	this.operationList = {
		sum: function (a, b) {
			return Math.ceil((a + b)*100)/100;
		},
		sub: function (a, b) {
			return Math.ceil((a - b)*100)/100;
		},
		mul: function (a, b) {
			return Math.ceil((a * b)*100)/100;
		},
		div: function (a, b) {
			return Math.ceil((a / b)*100)/100;
		},
		mod: function (a, b) {
			return Math.ceil((a % b)*100)/100;
		}
	};

	this.disableButtons();
	this.bindEvents();
}


Calculation.prototype = {
	checkNumber: function (node) {
		var _this = this;
		setTimeout(function() {

			if (!isNumeric(node.value) && node.value !== '') {
				node.classList.add('error');
				_this.showResult();
				_this.makeMessage();
				_this.addResultError();
			} else {
				node.classList.remove('error');
			}

			if (_this.operator1.classList.contains('error') || _this.operator2.classList.contains('error') || !isNumeric(_this.operator1.value) || !isNumeric(_this.operator2.value)) {
				_this.disableButtons();
			} else {
				_this.enableButtons();
				_this.hideResult();
				_this.removeResultError();
			}

		}, 800);
	},

	bindEvents: function () {
		var _this = this;
		this.sumNode.addEventListener('click', function(){
			_this.resultArea.textContent = _this.operationList.sum(parseFloat(_this.operator1.value), parseFloat(_this.operator2.value));
			_this.showResult();
		}, false);
		this.subNode.addEventListener('click', function(){
			_this.resultArea.textContent = _this.operationList.sub(parseFloat(_this.operator1.value), parseFloat(_this.operator2.value));
			_this.showResult();
		}, false);
		this.mulNode.addEventListener('click', function(){
			_this.resultArea.textContent = _this.operationList.mul(parseFloat(_this.operator1.value), parseFloat(_this.operator2.value));
			_this.showResult();
		}, false);
		this.divNode.addEventListener('click', function(){
			_this.resultArea.textContent = _this.operationList.div(parseFloat(_this.operator1.value), parseFloat(_this.operator2.value));
			_this.showResult();
		}, false);
		this.modNode.addEventListener('click', function(){
			_this.resultArea.textContent = _this.operationList.mod(parseFloat(_this.operator1.value), parseFloat(_this.operator2.value));
			_this.showResult();
		}, false);

		this.resetNode.addEventListener('click', function(){
			_this.clearInputs();
			_this.hideResult();
		}, false);

		this.operator1.addEventListener('keyup', function(){
			_this.checkNumber(this);
		}, false);
		this.operator2.addEventListener('keyup', function(){
			_this.checkNumber(this);
		}, false);
	},

	makeMessage: function () {
		this.resultArea.textContent = 'Please write only numbers';
	},

	removeMessage: function () {
		this.resultArea.textContent = '';
	},

	disableButtons: function() {
		this.sumNode.disabled = true;
		this.subNode.disabled = true;
		this.mulNode.disabled = true;
		this.divNode.disabled = true;
		this.modNode.disabled = true;
	},

	enableButtons: function() {
		this.sumNode.disabled = false;
		this.subNode.disabled = false;
		this.mulNode.disabled = false;
		this.divNode.disabled = false;
		this.modNode.disabled = false;
	},

	clearInputs: function() {
		this.operator1.value = '';
		this.operator2.value = '';
		this.operator1.classList.remove('error');
		this.operator2.classList.remove('error');
		this.removeMessage();
		this.disableButtons();
		this.hideResult();
	},

	showResult: function () {
		this.resultArea.classList.add('show');
	},

	hideResult: function () {
		this.resultArea.classList.remove('show');
	},

	addResultError: function () {
		this.resultArea.classList.add('error');
	},

	removeResultError: function () {
		this.resultArea.classList.remove('error');
	}
};