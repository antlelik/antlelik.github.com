(function() {
	window.onload = function() {
		walker.init();
	};

	var walker = {
		KEY_CODE_LEFT: 37,
		KEY_CODE_TOP: 38,
		KEY_CODE_RIGHT: 39,
		KEY_CODE_BOTTOM: 40,
		KEY_CODE_W: 87,
		KEY_CODE_S: 83,
		KEY_CODE_A: 65,
		KEY_CODE_D: 68,
		classTop: 'top',
		classBottom: 'bottom',
		classLeft: 'left',
		classRight: 'right',

		fieldUnit: {
			size: {
				width: 550,
				height: 550
			},
			obstacle: [
				[0,4,7,10],
				[3,7,10],
				[1,4],
				[1,4,5,10],
				[1,10],
				[8],
				[10],
				[1,6,7,8,10],
				[],
				[0,4,7,10],
				[1]
			],
			obstaclePositions: [],
		},
		fieldElement: null,
		unitElement: null,
		walkerUnit: {
			step: null,
			size: {
				width: null,
				height: null
			},
			position: {
				left: null,
				top: null
			},
			stepRatio: 5
		},
		init: function() {
			this.setUnitInitialPosition();
			this.checkKeyboardEvents();
			this.drapMapObastacle();
		},
		checkKeyboardEvents: function() {
			document.addEventListener('keydown', function(e) {
				switch (e.keyCode) {
					case this.KEY_CODE_TOP:
					case this.KEY_CODE_W:
						this.moveTop();
						break;
					case this.KEY_CODE_BOTTOM:
					case this.KEY_CODE_S:
						this.moveBottom();
						break;
					case this.KEY_CODE_LEFT:
					case this.KEY_CODE_A:
						this.moveLeft();
						break;
					case this.KEY_CODE_RIGHT:
					case this.KEY_CODE_D:
						this.moveRight();
						break;
				}
				this.updateUnitPosition();
			}.bind(this));

		},
		moveTop: function() {
			this.walkerUnit.position.top -= 1 * this.walkerUnit.step;
			if (this.unitElement.offsetTop <= this.walkerUnit.step) {
				this.walkerUnit.position.top = 0;
			}
			this.unitElement.className = this.classTop;
			this.checkMoveTop(this.walkerUnit.position.left, this.walkerUnit.position.top);
		},
		moveBottom: function() {
			this.walkerUnit.position.top += 1 * this.walkerUnit.step;
			if (this.unitElement.offsetTop >= this.fieldUnit.size.height - this.walkerUnit.size.height) {
				this.walkerUnit.position.top = this.fieldUnit.size.height - this.walkerUnit.size.height;
			}
			this.unitElement.className = this.classBottom;
			this.checkMoveBottom(this.walkerUnit.position.left, this.walkerUnit.position.top);
		},
		moveLeft: function() {
			this.walkerUnit.position.left -= 1 * this.walkerUnit.step;
			if (this.unitElement.offsetLeft <= this.walkerUnit.step) {
				this.walkerUnit.position.left = 0;
			}
			this.unitElement.className = this.classLeft;
			this.checkMoveLeft(this.walkerUnit.position.left, this.walkerUnit.position.top);
		},
		moveRight: function() {
			this.walkerUnit.position.left += 1 * this.walkerUnit.step;
			if (this.unitElement.offsetLeft >= this.fieldUnit.size.width - this.walkerUnit.size.width) {
				this.walkerUnit.position.left = this.fieldUnit.size.width - this.walkerUnit.size.width;
			}
			this.unitElement.className = this.classRight;
			this.checkMoveRight(this.walkerUnit.position.left, this.walkerUnit.position.top);
		},
		setUnitInitialPosition: function() {
			this.unitElement = document.querySelector('#unit');
			this.fieldElement = document.querySelector('.map-section');
			this.walkerUnit.size.width = this.unitElement.offsetWidth;
			this.walkerUnit.size.height = this.unitElement.offsetHeight;

			this.walkerUnit.step = this.walkerUnit.size.width / this.walkerUnit.stepRatio;
			this.walkerUnit.position.left = (this.fieldElement.offsetWidth - this.walkerUnit.size.width) / 2;
			this.walkerUnit.position.top = (this.fieldElement.offsetHeight - this.walkerUnit.size.height) / 2;

			this.updateUnitPosition();
		},
		updateUnitPosition: function() {
			this.unitElement.style.left = this.walkerUnit.position.left + 'px';
			this.unitElement.style.top = this.walkerUnit.position.top + 'px';
		},
		drapMapObastacle: function() {
			var self = this,
			    obstacleElement = document.createElement('div'),
			    obstacleStr = '';

			this.fieldUnit.obstacle.forEach(function(element, index){
				element.forEach(function(el, ind){
					obstacleStr += '<span class="obstacle" style="left: ' + self.walkerUnit.size.height * el + 'px; top: ' + self.walkerUnit.size.width * index + 'px;"></span>';
					self.fieldUnit.obstaclePositions.push([self.walkerUnit.size.height * el, self.walkerUnit.size.width * index]);
				});
			});

			obstacleElement.innerHTML = obstacleStr;
			obstacleElement.className = 'obstacle-list';
			this.fieldElement.appendChild(obstacleElement);

		},

		checkMoveTop: function(left, top) {
			this.fieldUnit.obstaclePositions.forEach(function(element, index) {
				// prevent move top through barrier
				if ((top < element[1] + this.walkerUnit.size.height && top > element[1] - this.walkerUnit.size.height ) && (left > element[0] - this.walkerUnit.size.width && left < element[0] + this.walkerUnit.size.width ) ) {
					this.walkerUnit.position.top = element[1] + this.walkerUnit.size.height;
				}
				this.updateUnitPosition();
			}.bind(this));
		},

		checkMoveBottom: function(left, top) {
			this.fieldUnit.obstaclePositions.forEach(function(element, index) {
				// prevent move bottom through barrier
				if ((top > element[1] - this.walkerUnit.size.height && top < element[1] + this.walkerUnit.size.height ) && (left > element[0] - this.walkerUnit.size.width && left < element[0] + this.walkerUnit.size.width ) ) {
					this.walkerUnit.position.top = element[1] - this.walkerUnit.size.height;
				}
				this.updateUnitPosition();
			}.bind(this));
		},

		checkMoveLeft: function(left, top) {
			this.fieldUnit.obstaclePositions.forEach(function(element, index) {
				// prevent move left through barrier
				if ((top > element[1] - this.walkerUnit.size.height && top < element[1] + this.walkerUnit.size.height ) && (left < element[0] + this.walkerUnit.size.width && left > element[0] ) ){
					this.walkerUnit.position.left = element[0] + this.walkerUnit.size.width;
				}
				this.updateUnitPosition();
			}.bind(this));
		},

		checkMoveRight: function(left, top) {
			this.fieldUnit.obstaclePositions.forEach(function(element, index) {
				// prevent move right through barrier
				if ((top > element[1] - this.walkerUnit.size.height && top < element[1] + this.walkerUnit.size.height ) && (left > element[0] - this.walkerUnit.size.width && left < element[0] ) ){
					this.walkerUnit.position.left = element[0] - this.walkerUnit.size.width;
				}
				this.updateUnitPosition();
			}.bind(this));
		}
	};


})();