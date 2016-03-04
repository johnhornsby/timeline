'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _motionTween = require('motion-tween');

var _motionTween2 = _interopRequireDefault(_motionTween);

var _timelineState = require('./timeline-state');

var _timelineState2 = _interopRequireDefault(_timelineState);

var _timelineAbstract = require('./timeline-abstract');

var _timelineAbstract2 = _interopRequireDefault(_timelineAbstract);

var Tween = (function () {
	function Tween(name) {
		_classCallCheck(this, Tween);

		this._propertyKeyframesMap = null;
		this._options = null;
		this._name = null;
		this._duration = 0;

		this._init(name);
	}

	/*________________________________________________________
 	PUBLIC CLASS METHODS
 ________________________________________________________*/

	_createClass(Tween, [{
		key: 'addKeyframes',
		value: function addKeyframes(keyframesObject) {
			this._addKeyframes(keyframesObject);
		}
	}, {
		key: 'getState',
		value: function getState(time) {
			return this._getState(time);
		}
	}, {
		key: '_init',

		/*________________________________________________________
  	PRIVATE CLASS METHODS
  ________________________________________________________*/

		value: function _init(name) {

			if (name == null) {
				throw Error("Name not specified");
			}

			this._name = name;

			this._propertyKeyframesMap = new Map();
		}
	}, {
		key: '_addKeyframes',
		value: function _addKeyframes(keyframesObject) {
			var _this = this;

			var keyframes = undefined;

			Object.keys(keyframesObject).map(function (key, index) {

				keyframes = _this._cloneKeyframes(keyframesObject[key]);

				_this._propertyKeyframesMap.set(key, keyframes);
			});

			this._duration = this._getKeyframesDuration();
		}

		/**
   * Method clones the array of keyframes
   *
   * @private
   * @param {Array} keyframes An Array of keyframe objects
   * @returns Array
   */
	}, {
		key: '_cloneKeyframes',
		value: function _cloneKeyframes(keyframes) {
			var keyframesCloned = keyframes.map(function (keyframe) {
				return _extends({}, keyframe);
			});

			return keyframesCloned;
		}
	}, {
		key: '_getKeyframesDuration',
		value: function _getKeyframesDuration() {
			var duration = 0;
			// the durationdetermined here is relative to the entire tween, yet to be clipped by in and out
			this._propertyKeyframesMap.forEach(function (keyframes, key) {
				keyframes.forEach(function (keyframe, index) {
					duration = Math.max(duration, keyframe.time);
				});
			});

			return duration;
		}

		/**
   * Method calculates and returns the values for each property at the given time
   *
   * @private
   * @param {Number} time Time in milisecond
   * @return Object
   */
	}, {
		key: '_getState',
		value: function _getState(time) {
			var _this2 = this;

			var state = new _timelineState2['default'](_timelineState2['default'].TYPE.TWEEN, this._name);

			this._propertyKeyframesMap.forEach(function (keyframes, property) {

				state.addProperty(property, _this2._getTweenValue(keyframes, time));
			});

			return state;
		}

		/**
   * Method takes an array of Keyframes and time and returns the tweened value at that time
   *
   * @private
   * @param {Array} keyframes Array of keyframe objects with time and value properties.
   * @param {Number} time Time in milisecond
   * @return Number
   */
	}, {
		key: '_getTweenValue',
		value: function _getTweenValue(keyframes, time) {
			var value = null;
			// interate over keyframes untill we find the exact value or keyframes either side
			var length = keyframes.length;
			var keyframe = undefined,
			    keyframeValue = undefined;
			var lastKeyframe = undefined;

			// the aim here is to find the keyframe to either side of the time value

			var previousKeyframe = null;
			var nextKeyframe = null;

			for (var i = 0; i < length; i++) {
				keyframe = keyframes[i];
				keyframeValue = keyframe.value;

				if (time === keyframe.time) {
					return keyframe.value;
				} else if (time > keyframe.time) {
					previousKeyframe = keyframe;
					// no need to break here as we continue iterating through keyFrames to find the keyframe just previous to the time value
				} else if (time < keyframe.time) {
						nextKeyframe = keyframe;
						break; // break here has we have gone far enough to get the next keyFrame
					}
			}

			if (previousKeyframe == null && nextKeyframe == null) {
				return value;
			}

			if (previousKeyframe == null) {
				return nextKeyframe.value;
			}

			if (nextKeyframe == null) {
				return previousKeyframe.value;
			}

			if (previousKeyframe != null && nextKeyframe != null) {
				// check for a hold keyframe
				if (previousKeyframe.hold != null && previousKeyframe.hold === true) {
					return previousKeyframe.value;
				}

				value = this._tweenBetweenKeyframes(previousKeyframe, nextKeyframe, time);
			}

			return value;
		}

		/**
  * Method calculates the value between two keyframes
  *
  * @private
  * @param {Object} lastKeyframe left keyframe object
  * @param {Object} keyframe right keyframe object
  * @param {Number} time Time in milisecond
  * @return Number
  */
	}, {
		key: '_tweenBetweenKeyframes',
		value: function _tweenBetweenKeyframes(lastKeyframe, keyframe, time) {
			// time difference between keyframes
			var timeDifference = keyframe.time - lastKeyframe.time;
			// percentage float 0-1 of time through difference
			var deltaFloat = (time - lastKeyframe.time) / timeDifference;

			var easedDelta = deltaFloat;

			if (lastKeyframe.animatorType != null) {
				var animatorOptions = {};
				if (lastKeyframe.animatorOptions != null) {
					animatorOptions = _extends({}, animatorOptions, lastKeyframe.animatorOptions);
				}

				easedDelta = _motionTween2['default'].getValue(lastKeyframe.animatorType, animatorOptions, deltaFloat);
			}

			var valueDifference = keyframe.value - lastKeyframe.value;
			var tweenedValue = lastKeyframe.value + valueDifference * easedDelta;

			return tweenedValue;
		}
	}, {
		key: 'duration',
		get: function get() {
			return this._duration;
		}
	}, {
		key: 'name',
		get: function get() {
			return this._name;
		}
	}]);

	return Tween;
})();

exports['default'] = Tween;
module.exports = exports['default'];