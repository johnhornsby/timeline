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

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _timeline = __webpack_require__(1);

	var _timeline2 = _interopRequireDefault(_timeline);

	var _tween = __webpack_require__(2);

	var _tween2 = _interopRequireDefault(_tween);

	exports.Timeline = _timeline2['default'];
	exports.Tween = _tween2['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TIMELINE_DEFAULT_OPTIONS = {
	  loop: false
	};

	var Timeline = (function () {
	  function Timeline(options) {
	    _classCallCheck(this, Timeline);

	    //this._currentTime = 0;
	    this._loop = null;
	    this._options = null;
	    this._duration = null;
	    this._tweens = [];

	    this._init(options);
	  }

	  _createClass(Timeline, [{
	    key: "addTween",
	    value: function addTween(tween) {
	      this._addTween(tween);
	    }
	  }, {
	    key: "getState",
	    value: function getState(time) {
	      return this._getState(time);
	    }
	  }, {
	    key: "_init",
	    value: function _init(options) {
	      this._options = Object.assign({}, TIMELINE_DEFAULT_OPTIONS, options);
	    }
	  }, {
	    key: "_addTween",
	    value: function _addTween(tween) {
	      if (this._tweens.indexOf(tween) === -1) {
	        this._tweens.push(tween);
	        this._updateDuration();
	      }
	    }
	  }, {
	    key: "_updateDuration",
	    value: function _updateDuration() {
	      var _this = this;

	      this._duration = 0;
	      this._tweens.forEach(function (tween, index) {
	        _this._duration = Math.max(_this._duration, tween.duration);
	      });
	    }
	  }, {
	    key: "_getState",
	    value: function _getState(time) {
	      var stateMap = new Map();
	      // if (this._loop) {
	      //   // wrap time
	      //   time = ((time % this._duration) + this._duration) % this._duration;
	      // }
	      // // iterate over map properies
	      this._tweens.forEach(function (tween, index) {
	        //   // interate over object properties
	        stateMap.set(tween.identifier, tween.getState(time));
	        //   const propertiesStateObject = {};
	        //   let keyframes;

	        //   for (var prop in propertiesObject) {
	        //     if ( propertiesObject.hasOwnProperty( prop )) {
	        //       keyframes = propertiesObject[prop];
	        //       propertiesStateObject[prop] = this._getTweenValue(keyframes, time);
	        //     }
	        //   }
	        //   // set tweenObject back into map against key
	        //   stateMap.set(key, propertiesStateObject);
	      });
	      // // return map
	      return stateMap;
	    }
	  }, {
	    key: "duration",
	    get: function get() {
	      return this._duration;
	    },
	    set: function set(duration) {
	      this._duration = this._options.duration = duration;
	    }
	  }, {
	    key: "loop",
	    set: function set(boolean) {
	      this._loop = boolean;
	    }
	  }]);

	  return Timeline;
	})();

	exports["default"] = Timeline;
	module.exports = exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _DEFAULT_OPTIONS = {
		loop: false,
		"in": 0,
		out: null,
		duration: null,
		scale: 1
	};

	var Tween = (function () {
		function Tween(propertyKeyframes, identifier, options) {
			_classCallCheck(this, Tween);

			this._propertyKeyframesMap = null;

			this._identifier = null;

			this._options = null;

			this._init(propertyKeyframes, identifier, options);
		}

		_createClass(Tween, [{
			key: "getState",
			value: function getState(time) {
				return this._getState(time);
			}
		}, {
			key: "_init",
			value: function _init(propertyKeyframes, identifier, options) {
				this._options = _extends({}, _DEFAULT_OPTIONS, options);

				this._identifier = identifier;

				this._processProperties(propertyKeyframes);

				this._updateDuration();
			}
		}, {
			key: "_processProperties",
			value: function _processProperties(propertyKeyframes) {
				var _this = this;

				this._propertyKeyframesMap = new Map();

				Object.keys(propertyKeyframes).map(function (key, index) {
					_this._propertyKeyframesMap.set(key, propertyKeyframes[key]);
				});
			}
		}, {
			key: "_updateDuration",
			value: function _updateDuration() {
				var _this2 = this;

				this._duration = 0;

				this._propertyKeyframesMap.forEach(function (keyframes, key) {
					keyframes.forEach(function (keyframe, index) {
						_this2._duration = Math.max(_this2._duration, keyframe.time);
					});
				});
			}
		}, {
			key: "_getState",
			value: function _getState(time) {
				var _this3 = this;

				if (this._loop) {
					// wrap time
					time = (time % this._duration + this._duration) % this._duration;
				}

				var propertiesStateObject = {};

				this._propertyKeyframesMap.forEach(function (keyframes, property) {
					propertiesStateObject[property] = _this3._getTweenValue(keyframes, time);
				});

				return propertiesStateObject;
			}
		}, {
			key: "_getTweenValue",
			value: function _getTweenValue(keyframes, time) {
				var value = undefined;
				// interate over keyframes untill we find the exact value or keyframes either side
				var length = keyframes.length;
				var keyframe = undefined,
				    keyframeValue = undefined;
				var lastKeyframe = undefined;
				for (var i = 0; i < length; i++) {
					keyframe = keyframes[i];
					keyframeValue = keyframe.value;
					if (time === keyframe.time) {
						// time matches keyframe exactly
						value = keyframeValue;
						break;
					} else if (time > keyframe.time) {

						if (this._loop && length > 1 && i === length - 1) {
							// if time is beyond the last keyframe && if the keyframe is not the only one then tween between last and first
							var firstKeyframe = keyframes[0];
							value = this._tweenBetweenKeyframes(keyframe, firstKeyframe, time);
							break;
						} else {
							// time is beyond keyframe, save as last and move on
							value = keyframeValue;
							lastKeyframe = keyframe;
						}
					} else if (time < keyframe.time) {
						if (i === 0) {
							// if next keyframe is not the only one then tween between last and first
							if (this._loop && length > 1) {
								lastKeyframe = keyframes[length - 1];
								value = this._tweenBetweenKeyframes(lastKeyframe, keyframe, time);
							} else {
								// first keyframe time is beyond keyframe.time, use this value
								value = keyframeValue;
							}
							break;
						} else {
							// we have now clarified that the time is between two keyframes, this is where we tween
							value = this._tweenBetweenKeyframes(lastKeyframe, keyframe, time);
							break;
						}
					}
				}
				return value;
			}
		}, {
			key: "_tweenBetweenKeyframes",
			value: function _tweenBetweenKeyframes(lastKeyframe, keyframe, time) {
				var timeDifference = keyframe.time - lastKeyframe.time;
				var deltaFloat = (time - lastKeyframe.time) / timeDifference;

				if (keyframe.time < lastKeyframe.time) {
					// we are looping and needing to use the last keyframe as lastKeyframe
					timeDifference = this._duration - lastKeyframe.time + keyframe.time;

					if (time < lastKeyframe.time) {
						// time is less that the last keyframe.time and requires the difference
						// between the last keyframe.time and the duration to be taken into account
						deltaFloat = (this._duration - lastKeyframe.time + time) / timeDifference;
					} else {
						deltaFloat = (time - lastKeyframe.time) / timeDifference;
					}
				}

				var valueDifference = keyframe.value - lastKeyframe.value;
				var tweenedValue = lastKeyframe.value + valueDifference * deltaFloat;

				return tweenedValue;
			}
		}, {
			key: "propertyKeyframesMap",
			get: function get() {
				return this._propertyKeyframesMap;
			}
		}, {
			key: "identifier",
			get: function get() {
				return this._identifier;
			}
		}, {
			key: "duration",
			get: function get() {
				return this._duration;
			}
		}]);

		return Tween;
	})();

	exports["default"] = Tween;
	module.exports = exports["default"];

/***/ }
/******/ ])
});
;