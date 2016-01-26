(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
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
	    this._tweens = new Map();

	    this._init(options);
	  }

	  _createClass(Timeline, [{
	    key: "addTweenLayer",
	    value: function addTweenLayer(tweenLayer) {
	      this._addTweenLayer(tweenLayer);
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
	    key: "_addTweenLayer",
	    value: function _addTweenLayer(tweenLayer) {
	      var _this = this;

	      // here we need to merge tween map with our tweens map
	      //iterate over map and clone value

	      tweenLayer.forEach(function (propertiesObject, key) {
	        if (_this._tweens.has(key) === false) {
	          _this._tweens.set(key, propertiesObject);
	          _this._updateDuration(tweenLayer);
	        }
	      });
	    }
	  }, {
	    key: "_updateDuration",
	    value: function _updateDuration(tweenLayer) {
	      var _this2 = this;

	      // if duration has been specifically set then don't auto calculate
	      if (this._options.duration == null) {
	        if (this._duration == null) {
	          this._duration = 0;
	        }

	        this._tweens.forEach(function (propertiesObject, key) {
	          for (var prop in propertiesObject) {
	            if (propertiesObject.hasOwnProperty(prop)) {
	              propertiesObject[prop].forEach(function (keyframe, index) {
	                _this2._duration = Math.max(_this2._duration, keyframe.time);
	              });
	            }
	          }
	        });
	      }
	    }
	  }, {
	    key: "_getState",
	    value: function _getState(time) {
	      var _this3 = this;

	      var stateMap = new Map();
	      if (this._loop) {
	        // wrap time
	        time = (time % this._duration + this._duration) % this._duration;
	      }
	      // iterate over map properies
	      this._tweens.forEach(function (propertiesObject, key) {
	        // interate over object properties

	        var propertiesStateObject = {};
	        var keyframes = undefined;

	        for (var prop in propertiesObject) {
	          if (propertiesObject.hasOwnProperty(prop)) {
	            keyframes = propertiesObject[prop];
	            propertiesStateObject[prop] = _this3._getTweenValue(keyframes, time);
	          }
	        }
	        // set tweenObject back into map against key
	        stateMap.set(key, propertiesStateObject);
	      });
	      // return map
	      return stateMap;
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

/***/ }
/******/ ])
});
;