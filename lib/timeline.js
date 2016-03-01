'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _timelineState = require('./timeline-state');

var _timelineState2 = _interopRequireDefault(_timelineState);

var _timelineAbstract = require('./timeline-abstract');

var _timelineAbstract2 = _interopRequireDefault(_timelineAbstract);

var _TIMELINE_DEFAULT_OPTIONS = {
	fps: 60
};

var Timeline = (function (_TimelineAbstract) {
	_inherits(Timeline, _TimelineAbstract);

	function Timeline(name, options) {
		_classCallCheck(this, Timeline);

		_get(Object.getPrototypeOf(Timeline.prototype), 'constructor', this).call(this, name, options);
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
		value: function addChild(child, time) {
			this._addChild(child, time);
		}
	}, {
		key: '_init',

		/*________________________________________________________
  	PRIVATE CLASS METHODS
  ________________________________________________________*/

		value: function _init(name, options) {
			_get(Object.getPrototypeOf(Timeline.prototype), '_init', this).call(this, name, options);

			this._options = _extends({}, _TIMELINE_DEFAULT_OPTIONS, this._options);
		}
	}, {
		key: '_addChild',
		value: function _addChild(child) {
			var time = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

			var o = {
				child: child,
				time: time
			};

			this._children.push(o);

			var absoluteDuration = this._getAbsoluteDuration();

			this._updateRelativeDuration(absoluteDuration);
		}
	}, {
		key: '_getAbsoluteDuration',
		value: function _getAbsoluteDuration() {
			var duration = 0;

			this._children.forEach(function (childObjectData, index) {
				duration = Math.max(duration, childObjectData.time + childObjectData.child.duration);
			});

			return duration;
		}
	}, {
		key: '_getState',
		value: function _getState(time) {
			var state = new _timelineState2['default'](_timelineState2['default'].TYPE.TIMELINE, this._name);
			var tweenState = undefined;

			this._children.forEach(function (childObjectData, index) {
				tweenState = childObjectData.child.getState(time - childObjectData.time);
				state.addChild(tweenState);
			});

			return state;
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
	}]);

	return Timeline;
})(_timelineAbstract2['default']);

exports['default'] = Timeline;
module.exports = exports['default'];

// An Array of Objects {tween, time}