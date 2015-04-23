(function() {
'use strict';
	/*
	StopWatch navigation:
	Press 'S' at keyboard to start/stop
	Press 'L' at keyboard to show lap
	Press 'R' at keyboard to reset stopWatch
	*/

	var START_STOP_KEYCODE = 83;
	var LAP_KEYCODE = 76;
	var RESET_KEYCODE = 82;

	// create class StopWatch 
	function StopWatch(node) {
		this.node = document.querySelector(node);
		this.lap = [];
		this.intervalTime = null;
		this.intervalPassed = 0;

		this.timerHolderNode = this.node.querySelector('.timer');
		this.lapHolderNode = this.node.querySelector('.result-list');
		this.btnReset = this.node.querySelector('.btn-reset');
		this.btnStartStop = this.node.querySelector('.btn-start');
		this.btnLap = this.node.querySelector('.btn-lap');

		this.bindEvents();
		this.drawTime();
	}

	StopWatch.prototype = {
		pressStartStop: function(node) {
			var _this = this;
			if (node.textContent === 'Stop') {
				node.textContent = 'Start';
				_this.stop();
			} else {
				_this.start();
				node.textContent = 'Stop';
			}
		},

		pressLaps: function() {
			var _this = this;
			_this.laps();
		},

		pressReset: function() {
			var _this = this;
			_this.reset();
		},
		bindEvents: function() {
			var _this = this;
			StopWatch.lastActive = this;
			this.node.addEventListener('mouseover', function() {
				StopWatch.lastActive = _this;
			}, false);

			document.addEventListener('keydown', function(e) {
				if (stopwatch.lastActive === _this) {
					var event = e || window.e;
					var keyCode = event.which;

					if (keyCode === START_STOP_KEYCODE) {
						_this.pressStartStop(_this.btnStartStop);
					}

					if (keyCode === LAP_KEYCODE) {
						_this.pressLaps(_this.btnLap);
					}

					if (keyCode === RESET_KEYCODE) {
						_this.pressReset(_this.btnReset);
					}
				}
			}, false);

			this.btnStartStop.addEventListener('click', function() {
			_this.pressStartStop(this);
			}, false);

			this.btnLap.addEventListener('click', function() {
				_this.pressLaps(this);
			}, false);

			this.btnReset.addEventListener('click', function() {
				_this.pressReset(this);
			}, false);

			this.lapHolderNode.addEventListener('click', function(e) {
				var _event = e;
				_this.removeLaps(_event);
			}, false);

		},

		// push time to page
		drawTime: function() {
			this.timerHolderNode.textContent = this.formatTime(this.intervalPassed);
		},

		// create format for timer
		formatTime: function(elapsed) {
			this.totalTime = new Date(elapsed);
			var ms = this.totalTime.getUTCMilliseconds();
			var ss = this.totalTime.getUTCSeconds();
			var mm = this.totalTime.getUTCMinutes();
			var hh = this.totalTime.getUTCHours();
			if (ms === 0) {
				ms = '00';
			}
			if (ms >= '01' && ms <= '09') {
				ms = ms + '0';
			}
			if (ms < 100) {
				ms = '0' + ms;
			}
			if (ss < 10) {
				ss = '0' + ss;
			}
			if (mm < 10) {
				mm = '0' + mm;
			}
			if (hh < 10) {
				hh = '0' + hh;
			}
			return hh + ':' + mm + ':' + ss + ':' + ms;
		},

		// press start button
		start: function() {
			if (this.intervalTime) {
				return;
			}

			var _this = this;
			var prevTime = (new Date()).getTime();

			this.intervalTime = setInterval(function() {
				var nextTime = (new Date()).getTime();
				_this.intervalPassed += (nextTime - prevTime);
				prevTime = nextTime;
				_this.drawTime();
			}, 16);
		},

		// press stop button
		stop: function() {
			clearInterval(this.intervalTime);
			this.intervalTime = null;
		},

		// press reset button
		reset: function() {
			this.intervalPassed = 0;
			this.stop();
			this.drawTime();
			this.lap = [];
			this.drawLaps();
			this.btnStartStop.textContent = 'Start';
		},

		laps: function() {
			if (this.intervalPassed === this.lap[0]) {
				return;
			}

			this.lap.unshift(this.intervalPassed);
			this.drawLaps();
		},

		// build laps list
		drawLaps: function() {
			if (this.lap.length === 0) {
				this.lapHolderNode.innerHTML = '';
				return;
			} else {
				var _this = this;
				this.lapHolderNode.textContent = '';

				this.lap.forEach(function(element, index) {
					var lapWrapper = document.createElement('div');
					lapWrapper.classList.add('result');

					var removeElement = document.createElement('span');
					removeElement.classList.add('remove');
					lapWrapper.appendChild(removeElement);
					removeElement.setAttribute('data-item', index);

					var lapItem = document.createElement('div');
					lapWrapper.appendChild(lapItem);
					lapItem.classList.add('result-holder');

					lapItem.textContent = _this.formatTime(_this.lap[index]);
					_this.lapHolderNode.appendChild(lapWrapper);
				});
			}
		},

		// remove laps
		removeLaps: function(e) {
			if (e.target.className === 'remove') {
				this.lap.splice(e.target.getAttribute('data-item'), 1);
				this.drawLaps();
			}
		}
	};

	// save a Class
	window.stopwatch = StopWatch;

}());