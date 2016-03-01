'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _motionTween = require('motion-tween');

var _motionTween2 = _interopRequireDefault(_motionTween);

var _timelineState = require('./timeline-state');

var _timelineState2 = _interopRequireDefault(_timelineState);

var _timelineAbstract = require('./timeline-abstract');

var _timelineAbstract2 = _interopRequireDefault(_timelineAbstract);

var Tween = (function (_TimelineAbstract) {
	_inherits(Tween, _TimelineAbstract);

	function Tween(name, options) {
		_classCallCheck(this, Tween);

		_get(Object.getPrototypeOf(Tween.prototype), 'constructor', this).call(this, name, options);

		this._propertyKeyframesMap = null;
		this._propertyKeyframesMap = new Map();
	}

	/*________________________________________________________
 	PUBLIC CLASS METHODS
 ________________________________________________________*/

	_createClass(Tween, [{
		key: 'addKeyframes',
		value: function addKeyframes(property, keyframes) {
			this._addKeyframes(property, keyframes);
		}

		/*________________________________________________________
  	PRIVATE CLASS METHODS
  ________________________________________________________*/

	}, {
		key: '_validateOptions',
		value: function _validateOptions(options) {
			_get(Object.getPrototypeOf(Tween.prototype), '_validateOptions', this).call(this, options);

			// if (options.out != null && options.duration != null) {
			// 	throw Error("specify either and out time or duration, not both!");
			// }
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

			var absoluteDuration = this._getAbsoluteDuration();

			this._updateRelativeDuration(absoluteDuration);
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
		key: '_getAbsoluteDuration',
		value: function _getAbsoluteDuration() {
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

			time = this._resolveTime(time);

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
				if (time < this._options['in'] && (this._options.fillMode !== _timelineAbstract2['default'].FILL_MODE.BACKWARD && this._options.fillMode !== _timelineAbstract2['default'].FILL_MODE.BOTH)) {
					return value;
				}

				return nextKeyframe.value;
			}

			if (nextKeyframe == null) {
				if (time > this._options.out && (this._options.fillMode !== _timelineAbstract2['default'].FILL_MODE.FORWARD && this._options.fillMode !== _timelineAbstract2['default'].FILL_MODE.BOTH)) {
					return value;
				}

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
	}]);

	return Tween;
})(_timelineAbstract2['default']);

exports['default'] = Tween;
module.exports = exports['default'];