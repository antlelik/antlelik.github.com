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
                [0, 4, 7, 10],
                [3, 7, 10],
                [1, 4],
                [1, 4, 5, 10],
                [1, 10],
                [2],
                [10],
                [1, 6, 7, 8, 10],
                [],
                [0, 4, 7, 10],
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
            obstacle: {
                left: null,
                top: null
            },
            stepRatio: 0.2
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
            var newObstacleTop = parseFloat((this.walkerUnit.obstacle.top - this.walkerUnit.stepRatio).toFixed(1));
            var obstacleTop = Math.floor(newObstacleTop);
            var leftPositionPrev = Math.floor(this.walkerUnit.obstacle.left);
            var leftPositionNext = Math.ceil(this.walkerUnit.obstacle.left);

            this.unitElement.className = this.classTop;
            if (this.walkerUnit.obstacle.top === 0) {
                return;
            }
            if (this.fieldUnit.obstacle[obstacleTop].indexOf(leftPositionPrev) > -1 || this.fieldUnit.obstacle[obstacleTop].indexOf(leftPositionNext) > -1) {
                return;
            }

            this.walkerUnit.obstacle.top = parseFloat((this.walkerUnit.obstacle.top - this.walkerUnit.stepRatio).toFixed(1));
        },
        moveBottom: function() {
            var newObstacleTop = parseFloat((this.walkerUnit.obstacle.top + this.walkerUnit.stepRatio).toFixed(1));
            var obstacleTop = Math.ceil(newObstacleTop);
            var leftPositionPrev = Math.floor(this.walkerUnit.obstacle.left);
            var leftPositionNext = Math.ceil(this.walkerUnit.obstacle.left);
            
            this.unitElement.className = this.classBottom;
            if (this.walkerUnit.obstacle.top === (this.fieldUnit.size.height / this.walkerUnit.size.height) - 1) {
                return;
            }
            if (this.fieldUnit.obstacle[obstacleTop] && (this.fieldUnit.obstacle[obstacleTop].indexOf(leftPositionPrev) > -1 || this.fieldUnit.obstacle[obstacleTop].indexOf(leftPositionNext) > -1)) {
                return;
            }

            this.walkerUnit.obstacle.top = parseFloat((this.walkerUnit.obstacle.top + this.walkerUnit.stepRatio).toFixed(1));
        },
        moveLeft: function() {
            var newObstacleLeft = parseFloat((this.walkerUnit.obstacle.left - this.walkerUnit.stepRatio).toFixed(1));
            var obstacleLeft = Math.floor(newObstacleLeft);
            var topPositionPrev = Math.floor(this.walkerUnit.obstacle.top);
            var topPositionNext = Math.ceil(this.walkerUnit.obstacle.top);

            this.unitElement.className = this.classLeft;
            if (this.walkerUnit.obstacle.left === 0) {
                return;
            }
            if (this.fieldUnit.obstacle[topPositionPrev].indexOf(obstacleLeft) > -1 || this.fieldUnit.obstacle[topPositionNext].indexOf(obstacleLeft) > -1) {
                return;
            }

            this.walkerUnit.obstacle.left = parseFloat((this.walkerUnit.obstacle.left - this.walkerUnit.stepRatio).toFixed(1));
        },
        moveRight: function() {
            var newObstacleLeft = parseFloat((this.walkerUnit.obstacle.left + this.walkerUnit.stepRatio).toFixed(1));
            var obstacleLeft = Math.ceil(newObstacleLeft);
            var topPositionPrev = Math.floor(this.walkerUnit.obstacle.top);
            var topPositionNext = Math.ceil(this.walkerUnit.obstacle.top);

            this.unitElement.className = this.classRight;
            if (this.walkerUnit.obstacle.left === (this.fieldUnit.size.width / this.walkerUnit.size.width) - 1) {
                return;
            }
            if (this.fieldUnit.obstacle[topPositionPrev].indexOf(obstacleLeft) > -1 || this.fieldUnit.obstacle[topPositionNext].indexOf(obstacleLeft) > -1) {
                return;
            }

            this.walkerUnit.obstacle.left = parseFloat((this.walkerUnit.obstacle.left + this.walkerUnit.stepRatio).toFixed(1));
        },
        setUnitInitialPosition: function() {
            this.unitElement = document.querySelector('#unit');
            this.fieldElement = document.querySelector('.map-section');
            this.walkerUnit.size.width = this.unitElement.offsetWidth;
            this.walkerUnit.size.height = this.unitElement.offsetHeight;

            this.walkerUnit.step = this.walkerUnit.size.width / this.walkerUnit.stepRatio;
            this.walkerUnit.obstacle.left = (this.fieldElement.offsetWidth - this.walkerUnit.size.width) / 2 / this.walkerUnit.size.width;
            this.walkerUnit.obstacle.top = (this.fieldElement.offsetHeight - this.walkerUnit.size.height) / 2 / this.walkerUnit.size.height;

            this.updateUnitPosition();
        },
        updateUnitPosition: function() {
            this.unitElement.style.left = this.walkerUnit.obstacle.left * this.walkerUnit.size.width + 'px';
            this.unitElement.style.top = this.walkerUnit.obstacle.top * this.walkerUnit.size.height + 'px';
        },
        drapMapObastacle: function() {
            var self = this,
                obstacleElement = document.createElement('div'),
                obstacleStr = '';

            this.fieldUnit.obstacle.forEach(function(element, index) {
                element.forEach(function(el, ind) {
                    obstacleStr += '<span class="obstacle" style="left: ' + self.walkerUnit.size.height * el + 'px; top: ' + self.walkerUnit.size.width * index + 'px;"></span>';
                    self.fieldUnit.obstaclePositions.push([self.walkerUnit.size.height * el, self.walkerUnit.size.width * index]);
                });
            });

            obstacleElement.innerHTML = obstacleStr;
            obstacleElement.className = 'obstacle-list';
            this.fieldElement.appendChild(obstacleElement);
        }
    };
})();