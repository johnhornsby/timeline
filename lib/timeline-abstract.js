"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _DEFAULT_OPTIONS = {
	loop: false,
	in: 0,
	out: null,
	fillMode: 0
};

var TimelineAbstract = function () {
	function TimelineAbstract(name, options) {
		_classCallCheck(this, TimelineAbstract);

		this._options = null;
		this._name = null;


		this._init(name, options);
	}

	/*________________________________________________________
 	PUBLIC CLASS METHODS
 ________________________________________________________*/

	_createClass(TimelineAbstract, [{
		key: "getState",
		value: function getState(time) {
			return this._getState(time);
		}
	}, {
		key: "_init",


		/*________________________________________________________
  	PRIVATE CLASS METHODS
  ________________________________________________________*/

		value: function _init(name, options) {

			this._validateOptions(options);

			this._options = _extends({}, _DEFAULT_OPTIONS, options);

			this._name = name;
		}
	}, {
		key: "_validateOptions",
		value: function _validateOptions(options) {}
	}, {
		key: "_getState",
		value: function _getState(time) {}

		/**
   * Method iterates through keyframes for each property and determines our relative duration between in and out
   *
   * @private
   */

	}, {
		key: "_updateRelativeDuration",
		value: function _updateRelativeDuration(absoluteDuration) {
			var inIndex = -1;
			var duration = absoluteDuration;

			if (this._options.in == null) {
				this._options.in = 0;
			} else {
				// adjust the duration
				if (this._options.in > duration) {
					throw Error("In point is set beyond the end of the tween!");
				}
				duration -= this._options.in;
			}

			if (this._options.out != null) {
				duration = this._options.out - this._options.in;
			} else {
				this._options.out = this._options.in + duration;
			}

			this._duration = duration;

			if (this._options.in > this._options.out) {
				throw Error("tween in is greater than out!");
			}
		}

		/**
   * Method takes any time and wraps it accordingly to be within in and out points
   *
   * @private
   * @param {Number} time Time in milisecond
   * @return Number
   */

	}, {
		key: "_loopTime",
		value: function _loopTime(time) {
			return ((time - this._options.in) % this._duration + this._duration) % this._duration;
		}

		/**
   * Method takes any time and checks whether the time value requires wrapping, if so then returns wrapped time
   *
   * @private
   * @param {Number} time Time in milisecond
   * @return Number
   */

	}, {
		key: "_resolveTime",
		value: function _resolveTime(time) {
			if (time < this._options.in) {
				if (this._options.fillMode === TimelineAbstract.FILL_MODE.BACKWARD || this._options.fillMode === TimelineAbstract.FILL_MODE.BOTH) {
					if (this._options.loop) {
						return this._loopTime(time);
					}
				}
			}

			if (time > this._options.out) {
				if (this._options.fillMode === TimelineAbstract.FILL_MODE.FORWARD || this._options.fillMode === TimelineAbstract.FILL_MODE.BOTH) {
					if (this._options.loop) {
						return this._loopTime(time);
					}
				}
			}

			return time;
		}
	}, {
		key: "duration",
		get: function get() {
			return this._duration;
		}
	}, {
		key: "name",
		get: function get() {
			return this._name;
		}
	}, {
		key: "in",
		get: function get() {
			return this._options.in;
		}
	}, {
		key: "out",
		get: function get() {
			return this._options.out;
		}
	}, {
		key: "loop",
		get: function get() {
			return this._options.loop;
		}
	}, {
		key: "fillMode",
		get: function get() {
			return this._options.fillMode;
		}
	}]);

	return TimelineAbstract;
}();

TimelineAbstract.FILL_MODE = {
	NOME: 0,
	FORWARD: 1,
	BACKWARD: 2,
	BOTH: 3
};
exports.default = TimelineAbstract;