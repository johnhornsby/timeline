(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Timeline"] = factory();
	else
		root["Timeline"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.MotionTween = exports.Tween = exports.InteractiveTimeline = exports.Timeline = undefined;

	var _timeline = __webpack_require__(1);

	var _timeline2 = _interopRequireDefault(_timeline);

	var _interactiveTimeline = __webpack_require__(5);

	var _interactiveTimeline2 = _interopRequireDefault(_interactiveTimeline);

	var _tween = __webpack_require__(3);

	var _tween2 = _interopRequireDefault(_tween);

	var _motionTween = __webpack_require__(4);

	var _motionTween2 = _interopRequireDefault(_motionTween);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Timeline = _timeline2.default;
	exports.InteractiveTimeline = _interactiveTimeline2.default;
	exports.Tween = _tween2.default;
	exports.MotionTween = _motionTween2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _timelineState = __webpack_require__(2);

	var _timelineState2 = _interopRequireDefault(_timelineState);

	var _tween = __webpack_require__(3);

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

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TimelineState = function () {
		function TimelineState(type, name) {
			_classCallCheck(this, TimelineState);

			this._type = TimelineState.TYPE.TWEEN;
			this._children = null;
			this._properties = null;
			this._name = null;

			this._type = type;
			this._name = name;

			this._properties = {};

			if (this._type == TimelineState.TYPE.TIMELINE) {
				this._children = [];
			}
		}

		_createClass(TimelineState, [{
			key: "addProperty",
			value: function addProperty(key, value) {
				this._properties[key] = value;
			}
		}, {
			key: "addChild",
			value: function addChild(timelineStateInstance) {
				this._children.push(timelineStateInstance);
			}
		}, {
			key: "type",
			get: function get() {
				return this._type;
			}
		}, {
			key: "name",
			get: function get() {
				return this._name;
			}
		}, {
			key: "children",
			get: function get() {
				// if (this._type !== TimelineState.TYPE.TIMELINE) {
				// 	throw Error("TimelineState instance is not of type Timeline and there does not have children!");
				// }
				return this._children;
			}
		}, {
			key: "properties",
			get: function get() {
				// if (this._type !== TimelineState.TYPE.TWEEN) {
				// 	throw Error("TimelineState instance is not of type Tween and there does not have properties!");
				// }
				return this._properties;
			}
		}]);

		return TimelineState;
	}();

	TimelineState.TYPE = {
		TWEEN: "tween",
		TIMELINE: "timeline"
	};
	exports.default = TimelineState;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _motionTween = __webpack_require__(4);

	var _motionTween2 = _interopRequireDefault(_motionTween);

	var _timelineState = __webpack_require__(2);

	var _timelineState2 = _interopRequireDefault(_timelineState);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tween = function () {
		function Tween(name, keyframesObject) {
			_classCallCheck(this, Tween);

			this._propertyKeyframesMap = null;
			this._options = null;
			this._name = null;
			this._duration = 0;


			this._init(name, keyframesObject);
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

			value: function _init(name, keyframesObject) {

				if (name == null) {
					throw Error("Name not specified");
				}

				this._name = name;

				this._propertyKeyframesMap = new Map();

				if (keyframesObject != null) {
					this._addKeyframes(keyframesObject);
				}
			}
		}, {
			key: '_addKeyframes',
			value: function _addKeyframes(keyframesObject) {
				var _this = this;

				var keyframes = void 0;

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

				var state = new _timelineState2.default(_timelineState2.default.TYPE.TWEEN, this._name);

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

				// here we check for time being null, which we can get if time has been remapped. And is outside of range.
				if (time == null) {
					return value;
				}

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

					easedDelta = _motionTween2.default.getValue(lastKeyframe.animatorType, animatorOptions, deltaFloat);
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
	}();

	exports.default = Tween;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else {
			var a = factory();
			for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
		}
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		module.exports = __webpack_require__(1);


	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var _Utils = __webpack_require__(2);

		var _Utils2 = _interopRequireDefault(_Utils);

		var _Easing = __webpack_require__(3);

		var Easing = _interopRequireWildcard(_Easing);

		var _animatorsCubicBezier = __webpack_require__(4);

		var _animatorsCubicBezier2 = _interopRequireDefault(_animatorsCubicBezier);

		var _animatorsEase = __webpack_require__(5);

		var _animatorsEase2 = _interopRequireDefault(_animatorsEase);

		var _animatorsFriction = __webpack_require__(6);

		var _animatorsFriction2 = _interopRequireDefault(_animatorsFriction);

		var _animatorsSpring = __webpack_require__(7);

		var _animatorsSpring2 = _interopRequireDefault(_animatorsSpring);

		var _animatorsSpringRK4 = __webpack_require__(8);

		var _animatorsSpringRK42 = _interopRequireDefault(_animatorsSpringRK4);

		var MotionTween = (function () {
		  _createClass(MotionTween, null, [{
		    key: "DEFAULT_OPTIONS",
		    value: {
		      time: 1000,
		      startValue: 0,
		      endValue: 1,
		      animatorType: _animatorsFriction2["default"].Type,
		      animatorOptions: {}, // use defaults of selected type
		      update: function update() {},
		      complete: function complete() {}
		    },
		    enumerable: true
		  }, {
		    key: "easingFunction",
		    value: {
		      easeInQuad: Easing.easeInQuad,
		      easeOutQuad: Easing.easeOutQuad,
		      easeInOutQuad: Easing.easeInOutQuad,
		      swing: Easing.swing,
		      easeInCubic: Easing.easeInCubic,
		      easeOutCubic: Easing.easeOutCubic,
		      easeInOutCubic: Easing.easeInOutCubic,
		      easeInQuart: Easing.easeInQuart,
		      easeOutQuart: Easing.easeOutQuart,
		      easeInOutQuart: Easing.easeInOutQuart,
		      easeInQuint: Easing.easeInQuint,
		      easeOutQuint: Easing.easeOutQuint,
		      easeInOutQuint: Easing.easeInOutQuint,
		      easeInSine: Easing.easeInSine,
		      easeOutSine: Easing.easeOutSine,
		      easeInOutSine: Easing.easeInOutSine,
		      easeInExpo: Easing.easeInExpo,
		      easeOutExpo: Easing.easeOutExpo,
		      easeInOutExpo: Easing.easeInOutExpo,
		      easeInCirc: Easing.easeInCirc,
		      easeOutCirc: Easing.easeOutCirc,
		      easeInOutCirc: Easing.easeInOutCirc,
		      easeInElastic: Easing.easeInElastic,
		      easeOutElastic: Easing.easeOutElastic,
		      easeInOutElastic: Easing.easeInOutElastic,
		      easeInBack: Easing.easeInBack,
		      easeOutBack: Easing.easeOutBack,
		      easeInOutBack: Easing.easeInOutBack,
		      easeInBounce: Easing.easeInBounce,
		      easeOutBounce: Easing.easeOutBounce,
		      easeInOutBounce: Easing.easeInOutBounce
		    },
		    enumerable: true
		  }, {
		    key: "animatorType",
		    value: {
		      spring: _animatorsSpring2["default"].Type,
		      springRK4: _animatorsSpringRK42["default"].Type,
		      friction: _animatorsFriction2["default"].Type,
		      ease: _animatorsEase2["default"].Type,
		      cubicBezier: _animatorsCubicBezier2["default"].Type
		    },
		    enumerable: true
		  }]);

		  function MotionTween(options) {
		    _classCallCheck(this, MotionTween);

		    this._time = null;
		    this._startX = null;
		    this._endX = null;
		    this._lastTime = null;
		    this._startTime = null;
		    this._options = {};
		    this._isAnimating = false;
		    this._animator = null;
		    this._x = null;

		    this._init(options);
		    return this;
		  }

		  _createClass(MotionTween, [{
		    key: "start",
		    value: function start() {
		      this._start();
		    }
		  }, {
		    key: "destroy",
		    value: function destroy() {
		      this._destroy();
		    }
		  }, {
		    key: "_init",
		    value: function _init(options) {
		      // Deep merge of default and incoming options
		      _Utils2["default"].extend(this._options, MotionTween.DEFAULT_OPTIONS, true);
		      _Utils2["default"].extend(this._options, options, true);

		      // time we can ignore for some of the animators
		      this._time = this._options.time;
		      this._startX = this._options.startValue;
		      this._endX = this._options.endValue;
		    }
		  }, {
		    key: "_start",
		    value: function _start() {
		      this._lastTime = 0;
		      this._startTime = 0;

		      this._options.animatorOptions.destination = this._endX;
		      this._options.animatorOptions.origin = this._startX;

		      switch (this._options.animatorType) {
		        case _animatorsSpring2["default"].Type:
		          this._animator = new _animatorsSpring2["default"](this._options.animatorOptions);
		          break;
		        case _animatorsSpringRK42["default"].Type:
		          this._animator = new _animatorsSpringRK42["default"](this._options.animatorOptions);
		          break;
		        case _animatorsFriction2["default"].Type:
		          this._animator = new _animatorsFriction2["default"](this._options.animatorOptions);
		          break;
		        case _animatorsCubicBezier2["default"].Type:
		          this._animator = new _animatorsCubicBezier2["default"](this._options.animatorOptions);
		          break;
		        default:
		          this._animator = new _animatorsEase2["default"](this._options.animatorOptions);
		      }

		      this._isAnimating = true;
		      this._startTime = this._lastTime = new Date().getTime();

		      this._requestionAnimationFrameID = window.requestAnimationFrame(this._tick.bind(this));
		    }
		  }, {
		    key: "_destroy",
		    value: function _destroy() {
		      window.cancelAnimationFrame(this._requestionAnimationFrameID);
		      this._options = null;
		    }
		  }, {
		    key: "_tick",
		    value: function _tick() {
		      var now = new Date().getTime();

		      var delta = (now - this._lastTime) / this._time;
		      this._lastTime = now;

		      // pass in normalised delta
		      var x = this._animator.step(delta);

		      if (this._animator.isFinished() === false) {

		        this._x = x;

		        this._options.update(this._x);
		        this._requestionAnimationFrameID = window.requestAnimationFrame(this._tick.bind(this));
		      } else {
		        this._x = this._endX;
		        this._options.update(this._x);
		        this._options.complete();
		        this._isAnimating = false;
		      }
		    }
		  }], [{
		    key: "getValue",
		    value: function getValue(animatorType, animatorOptions, time) {
		      return MotionTween._getValue(animatorType, animatorOptions, time);
		    }
		  }, {
		    key: "_getValue",
		    value: function _getValue(animatorType, animatorOptions, time) {
		      switch (animatorType) {
		        case _animatorsCubicBezier2["default"].Type:
		          return _animatorsCubicBezier2["default"].getValue(animatorOptions, time);
		          break;
		        default:
		          return _animatorsEase2["default"].getValue(animatorOptions, time);
		      }
		    }
		  }]);

		  return MotionTween;
		})();

		exports["default"] = MotionTween;
		module.exports = exports["default"];

	/***/ },
	/* 2 */
	/***/ function(module, exports) {

		'use strict';

		Object.defineProperty(exports, '__esModule', {
		    value: true
		});

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

		var Utils = (function () {
		    function Utils() {
		        _classCallCheck(this, Utils);
		    }

		    _createClass(Utils, [{
		        key: 'extend',
		        value: function extend(destination, source) {
		            var isDeep = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

		            var hasDepth = false;
		            for (var property in source) {
		                hasDepth = false;
		                if (isDeep === true && source[property] && source[property].constructor) {
		                    if (source[property].constructor === Object) {
		                        hasDepth = true;
		                        destination[property] = this.extend({}, source[property], true);
		                    } else if (source[property].constructor === Function) {
		                        // if (window.console) console.warn("Can't clone, can only reference Functions");
		                        hasDepth = false;
		                    }
		                }
		                if (hasDepth === false) {
		                    destination[property] = source[property];
		                }
		            }
		            return destination;
		        }
		    }, {
		        key: 'sum',
		        value: function sum(arr) {
		            var sum = 0;
		            var d = arr.length;
		            while (d--) {
		                sum += arr[d];
		            }
		            return sum;
		        }
		    }]);

		    return Utils;
		})();

		exports['default'] = new Utils();

		(function () {
		    var lastTime = 0;
		    var vendors = ['ms', 'moz', 'webkit', 'o'];
		    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		    }

		    if (!window.requestAnimationFrame) {
		        window.requestAnimationFrame = function (callback, element) {
		            var currTime = new Date().getTime();
		            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		            var id = window.setTimeout(function () {
		                callback(currTime + timeToCall);
		            }, timeToCall);
		            lastTime = currTime + timeToCall;
		            return id;
		        };
		    }

		    if (!window.cancelAnimationFrame) {
		        window.cancelAnimationFrame = function (id) {
		            clearTimeout(id);
		        };
		    }
		})();
		module.exports = exports['default'];

	/***/ },
	/* 3 */
	/***/ function(module, exports) {

		// t: current time, b: begInnIng value, c: change In value, d: duration
		"use strict";

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		exports.swing = swing;
		exports.easeInQuad = easeInQuad;
		exports.easeOutQuad = easeOutQuad;
		exports.easeInOutQuad = easeInOutQuad;
		exports.easeInCubic = easeInCubic;
		exports.easeOutCubic = easeOutCubic;
		exports.easeInOutCubic = easeInOutCubic;
		exports.easeInQuart = easeInQuart;
		exports.easeOutQuart = easeOutQuart;
		exports.easeInOutQuart = easeInOutQuart;
		exports.easeInQuint = easeInQuint;
		exports.easeOutQuint = easeOutQuint;
		exports.easeInOutQuint = easeInOutQuint;
		exports.easeInSine = easeInSine;
		exports.easeOutSine = easeOutSine;
		exports.easeInOutSine = easeInOutSine;
		exports.easeInExpo = easeInExpo;
		exports.easeOutExpo = easeOutExpo;
		exports.easeInOutExpo = easeInOutExpo;
		exports.easeInCirc = easeInCirc;
		exports.easeOutCirc = easeOutCirc;
		exports.easeInOutCirc = easeInOutCirc;
		exports.easeInElastic = easeInElastic;
		exports.easeOutElastic = easeOutElastic;
		exports.easeInOutElastic = easeInOutElastic;
		exports.easeInBack = easeInBack;
		exports.easeOutBack = easeOutBack;
		exports.easeInOutBack = easeInOutBack;
		exports.easeInBounce = easeInBounce;
		exports.easeOutBounce = easeOutBounce;
		exports.easeInOutBounce = easeInOutBounce;

		function swing(t, b, c, d) {
			return easeOutQuad(t, b, c, d);
		}

		function easeInQuad(t, b, c, d) {
			return c * (t /= d) * t + b;
		}

		function easeOutQuad(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		}

		function easeInOutQuad(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t + b;
			return -c / 2 * (--t * (t - 2) - 1) + b;
		}

		function easeInCubic(t, b, c, d) {
			return c * (t /= d) * t * t + b;
		}

		function easeOutCubic(t, b, c, d) {
			return c * ((t = t / d - 1) * t * t + 1) + b;
		}

		function easeInOutCubic(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		}

		function easeInQuart(t, b, c, d) {
			return c * (t /= d) * t * t * t + b;
		}

		function easeOutQuart(t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		}

		function easeInOutQuart(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		}

		function easeInQuint(t, b, c, d) {
			return c * (t /= d) * t * t * t * t + b;
		}

		function easeOutQuint(t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		}

		function easeInOutQuint(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		}

		function easeInSine(t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		}

		function easeOutSine(t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		}

		function easeInOutSine(t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
		}

		function easeInExpo(t, b, c, d) {
			return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
		}

		function easeOutExpo(t, b, c, d) {
			return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		}

		function easeInOutExpo(t, b, c, d) {
			if (t == 0) return b;
			if (t == d) return b + c;
			if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		}

		function easeInCirc(t, b, c, d) {
			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
		}

		function easeOutCirc(t, b, c, d) {
			return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
		}

		function easeInOutCirc(t, b, c, d) {
			if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
		}

		function easeInElastic(t, b, c, d) {
			var s = 1.70158;var p = 0;var a = c;
			if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
			if (a < Math.abs(c)) {
				a = c;var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		}

		function easeOutElastic(t, b, c, d) {
			var s = 1.70158;var p = 0;var a = c;
			if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
			if (a < Math.abs(c)) {
				a = c;var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
		}

		function easeInOutElastic(t, b, c, d) {
			var s = 1.70158;var p = 0;var a = c;
			if (t == 0) return b;if ((t /= d / 2) == 2) return b + c;if (!p) p = d * (.3 * 1.5);
			if (a < Math.abs(c)) {
				a = c;var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
		}

		function easeInBack(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		}

		function easeOutBack(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		}

		function easeInOutBack(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
		}

		function easeInBounce(t, b, c, d) {
			return c - easeOutBounce(d - t, 0, c, d) + b;
		}

		function easeOutBounce(t, b, c, d) {
			if ((t /= d) < 1 / 2.75) {
				return c * (7.5625 * t * t) + b;
			} else if (t < 2 / 2.75) {
				return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
			} else if (t < 2.5 / 2.75) {
				return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
			} else {
				return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
			}
		}

		function easeInOutBounce(t, b, c, d) {
			if (t < d / 2) return easeInBounce(t * 2, 0, c, d) * .5 + b;
			return easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
		}

	/***/ },
	/* 4 */
	/***/ function(module, exports) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var CubicBezier = (function () {
		  _createClass(CubicBezier, null, [{
		    key: "DEFAULT_OPTIONS",
		    value: {
		      tolerance: 0.001,
		      controlPoints: [.15, .66, .83, .67],
		      destination: 1
		    },
		    enumerable: true
		  }, {
		    key: "Type",
		    value: "CubicBezier",
		    enumerable: true
		  }]);

		  function CubicBezier(options) {
		    _classCallCheck(this, CubicBezier);

		    // merge default with passed
		    this._options = _extends({}, CubicBezier.DEFAULT_OPTIONS, options);

		    this._x = 0;
		    this._time = 0;
		  }

		  _createClass(CubicBezier, [{
		    key: "step",
		    value: function step(delta) {
		      // t: current time, b: begInnIng value, c: change In value, d: duration
		      this._time += delta;
		      this._x = CubicBezier._getPointOnBezierCurve(this._options.controlPoints, this._time);
		      return this._x * this._options.destination;
		    }
		  }, {
		    key: "isFinished",
		    value: function isFinished() {
		      return this._time >= 1;
		    }
		  }], [{
		    key: "getValue",
		    value: function getValue(options, time) {
		      return CubicBezier._getPointOnBezierCurve(options.controlPoints, time);
		    }
		  }, {
		    key: "_getPointOnBezierCurve",
		    value: function _getPointOnBezierCurve(controlPoints, l) {
		      var a1 = { x: 0, y: 0 };
		      var a2 = { x: 1, y: 1 };

		      var c1 = { x: controlPoints[0], y: controlPoints[1] };
		      var c2 = { x: controlPoints[2], y: controlPoints[3] };

		      var b1 = CubicBezier._interpolate(a1, c1, l);
		      var b2 = CubicBezier._interpolate(c1, c2, l);
		      var b3 = CubicBezier._interpolate(c2, a2, l);

		      c1 = CubicBezier._interpolate(b1, b2, l);
		      c2 = CubicBezier._interpolate(b2, b3, l);

		      return CubicBezier._interpolate(c1, c2, l).y;
		    }
		  }, {
		    key: "_interpolate",
		    value: function _interpolate(p1, p2, l) {
		      var p3 = {};

		      p3.x = p1.x + (p2.x - p1.x) * l;
		      p3.y = p1.y + (p2.y - p1.y) * l;

		      return p3;
		    }
		  }]);

		  return CubicBezier;
		})();

		exports["default"] = CubicBezier;
		module.exports = exports["default"];

	/***/ },
	/* 5 */
	/***/ function(module, exports, __webpack_require__) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var _Easing = __webpack_require__(3);

		var Easing = _interopRequireWildcard(_Easing);

		var Ease = (function () {
		  _createClass(Ease, null, [{
		    key: "DEFAULT_OPTIONS",
		    value: {
		      tolerance: 0.001,
		      easingFunction: Easing.easeOutQuad,
		      destination: 1
		    },
		    enumerable: true
		  }, {
		    key: "Type",
		    value: "Ease",
		    enumerable: true
		  }]);

		  function Ease(options) {
		    _classCallCheck(this, Ease);

		    // merge default with passed
		    this._options = _extends({}, Ease.DEFAULT_OPTIONS, options);

		    this._x = 0;
		    this._time = 0;
		  }

		  _createClass(Ease, [{
		    key: "step",
		    value: function step(delta) {
		      // t: current time, b: begInnIng value, c: change In value, d: duration
		      this._time += delta;
		      this._x = this._options.easingFunction(this._time, 0, 1, 1);
		      return this._x * this._options.destination;
		    }
		  }, {
		    key: "isFinished",
		    value: function isFinished() {
		      return this._time >= 1;
		    }
		  }], [{
		    key: "getValue",
		    value: function getValue(options, time) {
		      return options.easingFunction(time, 0, 1, 1);
		    }
		  }]);

		  return Ease;
		})();

		exports["default"] = Ease;
		module.exports = exports["default"];

	/***/ },
	/* 6 */
	/***/ function(module, exports) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var Friction = (function () {
		  _createClass(Friction, null, [{
		    key: "DEFAULT_OPTIONS",
		    value: {
		      applyAcceleration: function applyAcceleration(accel) {
		        return accel;
		      },
		      friction: 0.1,
		      destination: 1,
		      tolerance: 0.001
		    },
		    enumerable: true
		  }, {
		    key: "Type",
		    value: "FRICTION",
		    enumerable: true
		  }]);

		  function Friction(options) {
		    _classCallCheck(this, Friction);

		    // merge default with passed
		    this._options = _extends({}, Friction.DEFAULT_OPTIONS, options);
		    this._v = 0;
		    this._x = 0;
		    this._acceleration = (this._options.destination - this._x) * this._options.friction;
		    this._previousX = 0;
		  }

		  _createClass(Friction, [{
		    key: "step",
		    value: function step(delta) {
		      // delta is ignored in the FrictionAnimator
		      this._acceleration = this._options.applyAcceleration(this._acceleration);

		      this._v += this._acceleration;
		      this._x += this._v;
		      this._v *= 1 - this._options.friction;

		      // reset the acceleration as this is set initially
		      this._acceleration = 0;
		      this._previousX = this._x;

		      return this._x;
		    }
		  }, {
		    key: "isFinished",
		    value: function isFinished() {
		      return Math.round(this._v / this._options.tolerance) === 0 && Math.round(this._x / this._options.tolerance) === this._options.destination / this._options.tolerance ? true : false;
		    }
		  }]);

		  return Friction;
		})();

		exports["default"] = Friction;
		module.exports = exports["default"];

	/***/ },
	/* 7 */
	/***/ function(module, exports) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var Spring = (function () {
		  _createClass(Spring, null, [{
		    key: "DEFAULT_OPTIONS",
		    value: {
		      stiffness: 100,
		      damping: 20,
		      tolerance: 0.001,
		      destination: 1
		    },
		    enumerable: true
		  }, {
		    key: "Type",
		    value: "SPRING",
		    enumerable: true
		  }]);

		  function Spring(options) {
		    _classCallCheck(this, Spring);

		    // merge default with passed
		    this._options = _extends({}, Spring.DEFAULT_OPTIONS, options);

		    this._v = 0;
		    this._x = 0;
		  }

		  _createClass(Spring, [{
		    key: "step",
		    value: function step(delta) {
		      var k = 0 - this._options.stiffness;
		      var b = 0 - this._options.damping;

		      var F_spring = k * (this._x - 1);
		      var F_damper = b * this._v;

		      var mass = 1;

		      this._v += (F_spring + F_damper) / mass * delta;
		      this._x += this._v * delta;

		      return this._x * this._options.destination;
		    }
		  }, {
		    key: "isFinished",
		    value: function isFinished() {
		      return Math.round(this._v / this._options.tolerance) === 0 && Math.round(this._x / this._options.tolerance) === this._options.destination / this._options.tolerance ? true : false;
		    }
		  }]);

		  return Spring;
		})();

		exports["default"] = Spring;
		module.exports = exports["default"];

	/***/ },
	/* 8 */
	/***/ function(module, exports) {

		// r4k from http://mtdevans.com/2013/05/fourth-order-runge-kutta-algorithm-in-javascript-with-demo/
		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var SpringRK4 = (function () {
		  _createClass(SpringRK4, null, [{
		    key: "DEFAULT_OPTIONS",
		    value: {
		      stiffness: 100,
		      damping: 20,
		      tolerance: 0.001,
		      x: 1,
		      v: 0,
		      destination: 1,
		      origin: 0
		    },
		    enumerable: true
		  }, {
		    key: "Type",
		    value: "SPRINGRK4",
		    enumerable: true
		  }]);

		  function SpringRK4(options) {
		    _classCallCheck(this, SpringRK4);

		    // merge default with passed
		    this._options = _extends({}, SpringRK4.DEFAULT_OPTIONS, options);

		    this._state = {
		      x: this._options.destination - this._options.origin,
		      v: this._options.v
		    };
		  }

		  _createClass(SpringRK4, [{
		    key: "_rk4",
		    value: function _rk4(state, a, dt) {
		      var x = state.x;
		      var v = state.v;
		      // Returns final (position, velocity) array after time dt has passed.
		      //        x: initial position
		      //        v: initial velocity
		      //        a: acceleration function a(x,v,dt) (must be callable)
		      //        dt: timestep
		      var x1 = x;
		      var v1 = v;
		      var a1 = a(x1, v1, 0);

		      var x2 = x + 0.5 * v1 * dt;
		      var v2 = v + 0.5 * a1 * dt;
		      var a2 = a(x2, v2, dt / 2);

		      var x3 = x + 0.5 * v2 * dt;
		      var v3 = v + 0.5 * a2 * dt;
		      var a3 = a(x3, v3, dt / 2);

		      var x4 = x + v3 * dt;
		      var v4 = v + a3 * dt;
		      var a4 = a(x4, v4, dt);

		      var xf = x + dt / 6 * (v1 + 2 * v2 + 2 * v3 + v4);
		      var vf = v + dt / 6 * (a1 + 2 * a2 + 2 * a3 + a4);

		      return {
		        x: xf,
		        v: vf
		      };
		    }
		  }, {
		    key: "_acceleration",
		    value: function _acceleration(x, v, dt) {
		      // This particular one models a spring with a 1kg mass
		      return -this._options.stiffness * x - this._options.damping * v;
		    }
		  }, {
		    key: "step",
		    value: function step(delta) {
		      this._state = this._rk4(this._state, this._acceleration.bind(this), delta);

		      return this.x;
		    }
		  }, {
		    key: "isFinished",
		    value: function isFinished() {
		      return Math.round(this._state.v / this._options.tolerance) === 0 && Math.round(this._state.x / this._options.tolerance) === 0 ? true : false;
		    }
		  }, {
		    key: "v",
		    set: function set(v) {
		      this._state.v = v;
		    }
		  }, {
		    key: "x",
		    set: function set(x) {
		      this._state.x = x;
		    },
		    get: function get() {
		      return this._options.destination - this._options.origin - this._state.x + this._options.origin;;
		    }
		  }, {
		    key: "destination",
		    set: function set(destination) {
		      this._options.destination = destination;
		      this._state.x = this._options.destination - this._options.origin;
		    }
		  }, {
		    key: "origin",
		    set: function set(origin) {
		      this._options.origin = origin;
		      this._state.x = this._options.destination - this._options.origin;
		    }
		  }]);

		  return SpringRK4;
		})();

		exports["default"] = SpringRK4;
		module.exports = exports["default"];

	/***/ }
	/******/ ])
	});
	;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _timeline = __webpack_require__(1);

	var _timeline2 = _interopRequireDefault(_timeline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var InteractiveTimeline = function (_Timeline) {
		_inherits(InteractiveTimeline, _Timeline);

		function InteractiveTimeline(name, options) {
			_classCallCheck(this, InteractiveTimeline);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InteractiveTimeline).call(this, name, options));

			_this._sequences = [];
			return _this;
		}

		/*________________________________________________________
	 	PUBLIC CLASS METHODS
	 ________________________________________________________*/

		_createClass(InteractiveTimeline, [{
			key: 'increment',
			value: function increment(timeDelta) {
				return this._increment(timeDelta);
			}
		}, {
			key: 'setSequences',
			value: function setSequences(sequences) {
				this._setSequences(sequences);
			}
		}, {
			key: 'getSequences',
			value: function getSequences() {
				return this._sequences;
			}

			/*________________________________________________________
	  	PRIVATE CLASS METHODS
	  ________________________________________________________*/

		}, {
			key: '_increment',
			value: function _increment(timeDelta) {
				var outDelta = void 0,
				    sequenceOutTime = void 0;

				// get current sequence
				var currentSequence = this._getSequenceByTime(this._currentTime);

				this._currentTime += timeDelta;

				// get updated sequence with current time
				var prospectiveSequence = this._getSequenceByTime(this._currentTime);

				// using sequences currently only works travelling forwards
				if (timeDelta > 0) {
					// we only start to think about redirect if last time was within a sequence
					if (currentSequence != null) {
						// check to see we have left the current sequence and that the current sequence has a next location
						if (currentSequence !== prospectiveSequence && currentSequence.next != null) {

							// if there is a prospective then check that its not the next of current
							if (prospectiveSequence != null) {

								if (currentSequence.next !== prospectiveSequence.label) {
									// if duration is set on current the outDelta should be from after the duration
									if (currentSequence.duration) {
										sequenceOutTime = currentSequence.time + currentSequence.duration;
									} else {
										// otherwise no duration set the current sequence extends to the begining of the prospective
										sequenceOutTime = prospectiveSequence.time;
									}
								} else {
									sequenceOutTime = prospectiveSequence.time;
								}
							} else {
								// if prospective is null and current is not, then a duration must be set, so use that

								sequenceOutTime = currentSequence.time + currentSequence.duration;
							}
							// this makes the assumption we have travelled forward and have moved out of the current sequence to the right,
							// if we have move out of the sequence to the left therefore backwards the outDelta is from the end of the
							// sequence
							outDelta = this._currentTime - sequenceOutTime;
							// adjust time and update current
							prospectiveSequence = this._getSequenceByLabel(currentSequence.next);

							this.currentTime = prospectiveSequence.time + outDelta;
						}
					}
				}

				return this._getState(this._currentTime);
			}
		}, {
			key: '_setSequences',
			value: function _setSequences(sequences) {
				// merge sequence
				// validate check for overlaping
				this._sequences = sequences;
			}
		}, {
			key: '_getSequenceByTime',
			value: function _getSequenceByTime(time) {
				var sequence = void 0;

				for (var i = 0; i < this._sequences.length; i++) {
					if (this._sequences[i].time > time) {
						break;
					}
					sequence = this._sequences[i];
				}

				if (sequence) {
					// check if time is beyond last sequence
					if (sequence.duration && time > sequence.time + sequence.duration) {
						return null;
					}
					// return the current sequence
					return sequence;
				}

				// no relevent sequences
				return null;
			}
		}, {
			key: '_getSequenceByLabel',
			value: function _getSequenceByLabel(label) {
				for (var i = 0; i < this._sequences.length; i++) {
					if (this._sequences[i].label === label) {
						return this._sequences[i];
					}
				}
			}
		}]);

		return InteractiveTimeline;
	}(_timeline2.default);

	exports.default = InteractiveTimeline;

/***/ }
/******/ ])
});
;