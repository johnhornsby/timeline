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