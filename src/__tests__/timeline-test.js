
import Timeline from '../timeline';

describe('_loopTime', () => {

	it('wraps time to within in and out points', () => {

		const timeline = new Timeline("test");
		let time, result, settings;

		settings = {
			in: 500,
			out: 800,
			time: 250
		}

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
