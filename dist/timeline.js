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
		fillMode: 0
	};

	var Tween = (function () {
		_createClass(Tween, null, [{
			key: "FILL_MODE",
			value: {
				NOME: 0,
				FORWARD: 1,
				BACKWARD: 2,
				BOTH: 3
			},
			enumerable: true
		}]);

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

			/*________________________________________________________
	  	PRIVATE CLASS METHODS
	  ________________________________________________________*/

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

					var keyframes = _this._validateKeyframes(propertyKeyframes[key]);

					_this._propertyKeyframesMap.set(key, keyframes);
				});
			}
		}, {
			key: "_validateKeyframes",
			value: function _validateKeyframes(keyframes) {

				var keyframesCloned = keyframes.map(function (keyframe) {
					return _extends({}, keyframe);
				});

				return keyframesCloned;
			}
		}, {
			key: "_updateDuration",
			value: function _updateDuration() {
				var keyframeDuration = 0;
				var inIndex = -1;

				this._propertyKeyframesMap.forEach(function (keyframes, key) {
					keyframes.forEach(function (keyframe, index) {
						keyframeDuration = Math.max(keyframeDuration, keyframe.time);
					});
				});

				this._duration = keyframeDuration;

				if (this._options["in"] == null) {
					this._options["in"] = 0;
				} else {
					// adjust the duration
					if (this._options["in"] > this._duration) {
						throw Error("In point is set beyond the end of the tween!");
					}
					this._duration -= this._options["in"];
				}

				if (this._options.out != null && this._options.duration != null) {
					throw Error("specify either and out time or duration, not both!");
				}

				if (this._options.duration != null) {
					this._options.out = this._options["in"] + this._options.duration;
					this._duration = this._options.duration;
				}

				if (this._options.out != null) {
					this._duration = this._options.out - this._options["in"];
				} else {
					this._options.out = this._options["in"] + this._duration;
				}

				if (this._options["in"] > this._options.out) {
					throw Error("tween in is greater than out!");
				}
			}
		}, {
			key: "_searchForKeyframeByTime",
			value: function _searchForKeyframeByTime() {}
		}, {
			key: "_getState",
			value: function _getState(time) {
				var _this2 = this;

				var propertiesStateObject = {};

				time = this._resolveTime(time);

				this._propertyKeyframesMap.forEach(function (keyframes, property) {

					propertiesStateObject[property] = _this2._getTweenValue(keyframes, time);
				});

				return propertiesStateObject;
			}
		}, {
			key: "_loopTime",
			value: function _loopTime(time) {
				return time = ((time - this._options["in"]) % this._options.duration + this._options.duration) % this._options.duration;
			}
		}, {
			key: "_resolveTime",
			value: function _resolveTime(time) {
				// resolve time
				if (time < this._options["in"]) {
					if (this._options.fillMode === Tween.FILL_MODE.BACKWARD || this._options.fillMode === Tween.FILL_MODE.BOTH) {
						if (this._options.loop) {
							return this._loopTime(time);
						}
					}
				}

				if (time > this._options.out) {
					if (this._options.fillMode === Tween.FILL_MODE.FORWARD || this._options.fillMode === Tween.FILL_MODE.BOTH) {
						if (this._options.loop) {
							return this._loopTime(time);
						}
					}
				}

				return time;
			}
		}, {
			key: "_getTweenValue",
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
						previousKeyframe = nextKeyframe = keyframe;
						break; // break here as we have found all we need
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
					previousKeyframe = nextKeyframe;
				}

				if (nextKeyframe == null) {
					nextKeyframe = previousKeyframe;
				}

				if (previousKeyframe != null && nextKeyframe != null) {
					value = this._tweenBetweenKeyframes(previousKeyframe, nextKeyframe, time);
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
					timeDifference = this._options.duration - lastKeyframe.time + keyframe.time;

					if (time < lastKeyframe.time) {
						// time is less that the last keyframe.time and requires the difference
						// between the last keyframe.time and the duration to be taken into account
						deltaFloat = (this._options.duration - lastKeyframe.time + time) / timeDifference;
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
				return this._options.duration;
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