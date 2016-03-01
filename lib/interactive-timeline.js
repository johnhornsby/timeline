'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _timeline = require('./timeline');

var _timeline2 = _interopRequireDefault(_timeline);

var InteractiveTimeline = (function (_Timeline) {
	_inherits(InteractiveTimeline, _Timeline);

	function InteractiveTimeline(name, options) {
		_classCallCheck(this, InteractiveTimeline);

		_get(Object.getPrototypeOf(InteractiveTimeline.prototype), 'constructor', this).call(this, name, options);
		this._sequences = [];
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
			var outDelta = undefined,
			    sequenceOutTime = undefined;

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
			var sequence = undefined;

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
})(_timeline2['default']);

exports['default'] = InteractiveTimeline;
module.exports = exports['default'];