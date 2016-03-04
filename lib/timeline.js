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

var _timelineState = require('./timeline-state');

var _timelineState2 = _interopRequireDefault(_timelineState);

var _tween = require('./tween');

var _tween2 = _interopRequireDefault(_tween);

var _TIMELINE_DEFAULT_OPTIONS = {
	fps: 60
};

var _CHILD_DEFAULT_OPTIONS = {
	fillMode: "both",
	'in': 0,
	loop: false,
	out: null,
	time: 0
};

var Timeline = (function (_Tween) {
	_inherits(Timeline, _Tween);

	_createClass(Timeline, null, [{
		key: 'FILL_MODE',
		value: {
			NOME: "none",
			FORWARD: "forward",
			BACKWARD: "backward",
			BOTH: "both"
		},
		enumerable: true
	}]);

	function Timeline(name, options) {
		_classCallCheck(this, Timeline);

		_get(Object.getPrototypeOf(Timeline.prototype), 'constructor', this).call(this, name);
		this._children = [];
		this._currentTime = 0;
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
		key: '_init',

		/*________________________________________________________
  	PRIVATE CLASS METHODS
  ________________________________________________________*/

		value: function _init(name, options) {
			_get(Object.getPrototypeOf(Timeline.prototype), '_init', this).call(this, name);

			this._options = _extends({}, _TIMELINE_DEFAULT_OPTIONS, options);
		}
	}, {
		key: '_addChild',
		value: function _addChild(child, options) {
			// clone options into settings property
			var o = {
				child: child,
				settings: _extends({}, _CHILD_DEFAULT_OPTIONS, options)
			};

			// set out property if not already set
			if (o.settings.out == null) {
				o.settings.out = o.settings.time + child.duration;
			}

			this._children.push(o);

			var absoluteDuration = this._getChildrenDuration();

			this._duration = absoluteDuration;
		}
	}, {
		key: '_removeChild',
		value: function _removeChild() {}
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
			var _this = this;

			var state = new _timelineState2['default'](_timelineState2['default'].TYPE.TIMELINE, this._name);
			var tweenState = undefined;

			var resolvedTime = undefined;

			this._children.forEach(function (childObjectData, index) {

				// loop is accounted for here, fill is automatically built into tween
				resolvedTime = _this._resolveChildRelativeTime(time, childObjectData.settings);

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
			var childEditDuration = childSettings.out - childSettings['in'];
			var realativeTime = time - childSettings['in'];
			var loopedTime = (realativeTime % childEditDuration + childEditDuration) % childEditDuration;
			return childSettings['in'] + loopedTime;
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
			// now we have the beginning position of the child we can determine the time relative to the child
			var childRelativeTime = time - childSettings.time;

			if (time < childSettings['in']) {
				if (childSettings.fillMode === Timeline.FILL_MODE.BACKWARD || childSettings.fillMode === Timeline.FILL_MODE.BOTH) {

					if (childSettings.loop) {
						return this._loopTime(time, childSettings) - childSettings.time;
					} else {
						return childSettings['in'] - childSettings.time;
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
})(_tween2['default']);

exports['default'] = Timeline;
module.exports = exports['default'];