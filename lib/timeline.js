'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _timelineState = require('./timeline-state');

var _timelineState2 = _interopRequireDefault(_timelineState);

var _tween = require('./tween');

var _tween2 = _interopRequireDefault(_tween);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _TIMELINE_DEFAULT_OPTIONS = {
	fps: 60
};

var _CHILD_DEFAULT_OPTIONS = {
	fillMode: "both",
	in: null,
	loop: false,
	out: null,
	time: null
};

var Timeline = function (_Tween) {
	_inherits(Timeline, _Tween);

	function Timeline(name, keyframesObject, options) {
		_classCallCheck(this, Timeline);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Timeline).call(this, name, keyframesObject, options));

		_this._children = [];
		_this._currentTime = 0;


		_this._options = _extends({}, _TIMELINE_DEFAULT_OPTIONS, options);
		return _this;
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
		key: 'next',
		value: function next() {
			return this._next();
		}
	}, {
		key: 'addChild',
		value: function addChild(child, options) {
			this._addChild(child, options);
		}
	}, {
		key: '_addChild',


		/*________________________________________________________
  	PRIVATE CLASS METHODS
  ________________________________________________________*/

		value: function _addChild(child, options) {
			// clone options into settings property
			var o = {
				child: child,
				settings: _extends({}, _CHILD_DEFAULT_OPTIONS, options)
			};

			// set time property if not already set
			if (o.settings.time == null) {
				o.settings.time = 0;
			}

			// set in property if not already set
			if (o.settings.in == null) {
				o.settings.in = o.settings.time;
			}

			// set out property if not already set
			if (o.settings.out == null) {
				o.settings.out = o.settings.time + child.duration;
			}

			this._validateChildOptions(o.settings);

			this._children.push(o);

			var childDuration = this._getChildrenDuration();

			var localDuration = this._getKeyframesDuration();

			this._duration = Math.max(childDuration, localDuration);
		}
	}, {
		key: '_validateChildOptions',
		value: function _validateChildOptions(settings) {
			var fillModes = Object.keys(Timeline.FILL_MODE).map(function (key) {
				return Timeline.FILL_MODE[key];
			});

			if (fillModes.indexOf(settings.fillMode) === -1) {
				throw new Error("Incorrectly set fillMode: " + settings.fillMode);
			}

			if (settings.in < settings.time) {
				throw new Error("The 'in' option can't preceed the 'time' option");
			}

			if (settings.in > settings.out) {
				throw new Error("The 'in' option can't be after the 'out' option");
			}

			if (settings.out < settings.time || settings.out < settings.in) {
				throw new Error("The 'out' option can't preceed the 'time' or 'in' option");
			}
		}
	}, {
		key: '_removeChild',
		value: function _removeChild() {
			// @TODO
		}
	}, {
		key: '_getChildrenDuration',
		value: function _getChildrenDuration() {
			var duration = 0;

			this._children.forEach(function (childObjectData, index) {

				duration = Math.max(duration, childObjectData.settings.out);
			});

			return duration;
		}
	}, {
		key: '_getState',
		value: function _getState(time) {
			var _this2 = this;

			var state = new _timelineState2.default(_timelineState2.default.TYPE.TIMELINE, this._name);
			var tweenState = void 0,
			    resolvedTime = void 0;

			// Check to see if we have specified the 'timeRemap' property,
			// if so remap time and then obtain state
			if (this._propertyKeyframesMap.size > 0) {
				if (this._propertyKeyframesMap.has("timeRemap")) {
					var keyframes = this._propertyKeyframesMap.get("timeRemap");

					// @TODO if time comes in here undefined then it is resolved to null,
					// where we usually expect an undefined to deliver us a null state property value
					// resolved time is returning as 0, and therefore we are not getting the correct state

					// 160619 this is now done, undefined in produces null out

					time = this._getTimeRemapTweenValue(keyframes, time);
				}
			}

			this._children.forEach(function (childObjectData, index) {

				// loop is accounted for here, fill is automatically built into tween
				resolvedTime = _this2._resolveChildRelativeTime(time, childObjectData.settings);

				tweenState = childObjectData.child.getState(resolvedTime);

				state.addChild(tweenState);
			});

			return state;
		}

		/**
   * Method takes any time and wraps it accordingly to be within in and out points
   *
   * @private
   * @param {Number} time Time in milisecond
   * @return Number
   */

	}, {
		key: '_loopTime',
		value: function _loopTime(time, childSettings) {
			var childEditDuration = childSettings.out - childSettings.in;
			var realativeTime = time - childSettings.in;
			var loopedTime = (realativeTime % childEditDuration + childEditDuration) % childEditDuration;
			return childSettings.in + loopedTime;
		}

		/**
   * Method takes any time and checks whether the time value requires wrapping, if so then returns wrapped time
   *
   * @private
   * @param {Number} time Time in milisecond
   * @return Number
   */

	}, {
		key: '_resolveChildRelativeTime',
		value: function _resolveChildRelativeTime(time, childSettings) {
			// brief check to see if the time is null or undefined, this may come as a result of attempting to obtain
			// a time outside of the parents range, previously below return 0 resulting in incorrect resolved time.
			if (time == null) {
				return time;
			}

			// now we have the beginning position of the child we can determine the time relative to the child
			var childRelativeTime = time - childSettings.time;

			if (time < childSettings.in) {
				if (childSettings.fillMode === Timeline.FILL_MODE.BACKWARD || childSettings.fillMode === Timeline.FILL_MODE.BOTH) {

					if (childSettings.loop) {
						return this._loopTime(time, childSettings) - childSettings.time;
					} else {
						return childSettings.in - childSettings.time;
					}
				} else {
					return undefined;
				}
			}

			if (time > childSettings.out) {
				if (childSettings.fillMode === Timeline.FILL_MODE.FORWARD || childSettings.fillMode === Timeline.FILL_MODE.BOTH) {
					if (childSettings.loop) {
						return this._loopTime(time, childSettings) - childSettings.time;
					} else {
						return childSettings.out - childSettings.time;
					}
				} else {
					return undefined;
				}
			}

			return childRelativeTime;
		}

		/**
   * Method takes an array of timeRemap Keyframes and time and returns the tweened time at that time
   *
   * @private
   * @param {Array} keyframes Array of keyframe objects with time and value properties.
   * @param {Number} time Time in milisecond
   * @return Number
   */

	}, {
		key: '_getTimeRemapTweenValue',
		value: function _getTimeRemapTweenValue(keyframes, time) {
			var value = null;
			// interate over keyframes untill we find the exact value or keyframes either side
			var length = keyframes.length;
			var keyframe = void 0,
			    keyframeValue = void 0;
			var lastKeyframe = void 0;

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
				// when we have no previouskeyframe the natural behaviour differs from standard tween keyframes,
				// instead of gleening the next keyframe value, we want to determine the time relative to the
				// time remaped at the nextKeyframe value. Look at the example below

				// nextKeyframe.time = 50
				// nextKeyframe.value = 25
				// time = 30
				// value = nextKeyframe.value - (nextKeyframe.time - time) // ergo 5

				return nextKeyframe.value - (nextKeyframe.time - time);
			}

			if (nextKeyframe == null) {

				// see above reasoning

				// previousKeyframe.time = 50
				// previousKeyframe.value = 25
				// time = 70
				// value = previousKeyframe.value - (previousKeyframe.time - time) // ergo 45

				return previousKeyframe.value - (previousKeyframe.time - time);
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
	}, {
		key: '_next',
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
		key: 'currentTime',
		set: function set(time) {
			this._currentTime = time;
		},
		get: function get() {
			return this._currentTime;
		}
	}, {
		key: 'duration',
		get: function get() {
			return this._duration;
		}
	}]);

	return Timeline;
}(_tween2.default);

Timeline.FILL_MODE = {
	NONE: "none",
	FORWARD: "forward",
	BACKWARD: "backward",
	BOTH: "both"
};
exports.default = Timeline;