"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TIMELINE_DEFAULT_OPTIONS = {
	loop: false,
	fps: 60
};

var Timeline = (function () {
	function Timeline(options) {
		_classCallCheck(this, Timeline);

		this._currentTime = 0;
		this._loop = null;
		this._options = null;
		this._duration = null;
		this._tweens = [];

		this._init(options);
	}

	/*________________________________________________________
 	PUBLIC CLASS METHODS
 ________________________________________________________*/

	_createClass(Timeline, [{
		key: Symbol.iterator,
		value: function value() {
			return this;
		}
	}, {
		key: "next",
		value: function next() {
			return this._next();
		}
	}, {
		key: "addTween",
		value: function addTween(tween, time) {
			this._addTween(tween, time);
		}
	}, {
		key: "getState",
		value: function getState(time) {
			return this._getState(time);
		}
	}, {
		key: "_init",

		/*________________________________________________________
  	PRIVATE CLASS METHODS
  ________________________________________________________*/

		value: function _init(options) {
			this._options = _extends({}, TIMELINE_DEFAULT_OPTIONS, options);
		}
	}, {
		key: "_addTween",
		value: function _addTween(tween) {
			var time = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

			if (this._tweens.length === 0 || this._tweens.find(function (tweenObjectData) {
				return tweenObjectData.tween === tween;
			}) === false) {
				this._tweens.push({
					tween: tween,
					time: time
				});
				this._updateDuration();
			}
		}
	}, {
		key: "_updateDuration",
		value: function _updateDuration() {
			var _this = this;

			this._duration = 0;
			this._tweens.forEach(function (tweenObjectData, index) {
				_this._duration = Math.max(_this._duration, tweenObjectData.time + tweenObjectData.tween.duration);
			});
		}
	}, {
		key: "_getState",
		value: function _getState(time) {
			var stateMap = new Map();
			// iterate over map properies
			this._tweens.forEach(function (tweenObjectData, index) {
				// interate over object properties
				stateMap.set(tweenObjectData.tween.identifier, tweenObjectData.tween.getState(time - tweenObjectData.time));
			});
			// return map
			return stateMap;
		}
	}, {
		key: "_next",
		value: function _next() {
			var time = this._currentTime;

			this._currentTime += 1000 / this._options.fps;

			var done = time >= this._duration;

			if (done) {
				this._currentTime = 0;
				return { done: done };
			} else {
				return {
					value: this._getState(time)
				};
			}
		}
	}, {
		key: "duration",
		set: function set(duration) {
			this._duration = this._options.duration = duration;
		},
		get: function get() {
			return this._duration;
		}
	}, {
		key: "loop",
		set: function set(boolean) {
			this._loop = boolean;
		},
		get: function get() {
			return this._loop;
		}
	}, {
		key: "currentTime",
		set: function set(time) {
			this._currentTime = time;
		},
		get: function get() {
			return this._currentTime;
		}
	}]);

	return Timeline;
})();

exports["default"] = Timeline;
module.exports = exports["default"];