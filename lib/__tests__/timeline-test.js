'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _timeline = require('../timeline');

var _timeline2 = _interopRequireDefault(_timeline);

describe('_loopTime', function () {

	it('wraps time to within in and out points', function () {

		var timeline = new _timeline2['default']("test");
		var time = undefined,
		    result = undefined,
		    settings = undefined;

		settings = {
			'in': 500,
			out: 800,
			time: 250
		};

		time = -300;
		result = timeline._loopTime(time, settings);
		expect(result).toEqual(600);

		time = 0;
		result = timeline._loopTime(time, settings);
		expect(result).toEqual(600);

		time = 300;
		result = timeline._loopTime(time, settings);
		expect(result).toEqual(600);

		time = 600;
		result = timeline._loopTime(time, settings);
		expect(result).toEqual(600);

		time = 900;
		result = timeline._loopTime(time, settings);
		expect(result).toEqual(600);
	});
});