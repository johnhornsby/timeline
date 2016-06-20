import Tween from '../tween';
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




describe('_getState', () => {


	it('returns the state of the timeline at a given time', () => {

		let state;

		const ringTween = new Tween("ring", {
			radius: [
				{
					time: 0, value: 70
				},
				{
					time: 200, value: 19
				}
			]
		});

		// here we remap the radius to finish in half the time
		const ringTimeline = new Timeline("ring-timeline",{
			timeRemap: [
				{
					time: 200,
					value: 200
				},
				{
					time: 300,
					value: 400
				}
			]
		});

		ringTimeline.addChild(ringTween, {fillMode: Timeline.FILL_MODE.NONE, loop: false, time: 200 });

		const rootTimeline = new Timeline("root-timeline");

		rootTimeline.addChild(ringTween, {fillMode: Timeline.FILL_MODE.NONE, loop: false, time: 200 });
		rootTimeline.addChild(ringTimeline, {fillMode: Timeline.FILL_MODE.NONE, loop: false, time: 0 });


		state = rootTimeline._getState(0);
		expect(state.children[0].properties.radius).toBeNull();

		state = rootTimeline._getState(200);
		expect(state.children[0].properties.radius).toEqual(70);
		expect(state.children[1].children[0].properties.radius).toEqual(70);

		state = rootTimeline._getState(300);
		expect(state.children[0].properties.radius).toEqual(44.5);
		expect(state.children[1].children[0].properties.radius).toEqual(19);

		state = rootTimeline._getState(400);
		expect(state.children[0].properties.radius).toEqual(19);
		expect(state.children[1].children[0].properties.radius).toBeNull();

		state = rootTimeline._getState(600);
		expect(state.children[0].properties.radius).toBeNull();

		state = rootTimeline._getState(undefined);
		expect(state.children[0].properties.radius).toBeNull();

		state = rootTimeline._getState(null);
		expect(state.children[0].properties.radius).toBeNull();

	});


	it('returns the state of the timeline at a given time, using different fillModes', () => {
		let state;

		const ringTween = new Tween("ring", {
			radius: [
				{
					time: 0, value: 70
				},
				{
					time: 200, value: 19
				}
			]
		});

		const rootTimeline = new Timeline("root-timeline");
		rootTimeline.addChild(ringTween, {fillMode: Timeline.FILL_MODE.NONE, loop: false, time: 200 });
		rootTimeline.addChild(ringTween, {fillMode: Timeline.FILL_MODE.FORWARD, loop: false, time: 200 });
		rootTimeline.addChild(ringTween, {fillMode: Timeline.FILL_MODE.BACKWARD, loop: false, time: 200 });
		rootTimeline.addChild(ringTween, {fillMode: Timeline.FILL_MODE.BOTH, loop: false, time: 200 });

		state = rootTimeline._getState(0);
		expect(state.children[0].properties.radius).toBeNull();
		expect(state.children[1].properties.radius).toBeNull();
		expect(state.children[2].properties.radius).toEqual(70);
		expect(state.children[3].properties.radius).toEqual(70);

		state = rootTimeline._getState(600);
		expect(state.children[0].properties.radius).toBeNull();
		expect(state.children[1].properties.radius).toEqual(19);
		expect(state.children[2].properties.radius).toBeNull();
		expect(state.children[3].properties.radius).toEqual(19);
	});


	it('returns the state of the timeline at a given time, using different fillModes while being time remapped', () => {
		let state;

		const ringTween = new Tween("ring", {
			radius: [
				{
					time: 0, value: 70
				},
				{
					time: 200, value: 19
				}
			]
		});

		// here we remap the radius to finish in half the time
		const ringTimeline = new Timeline("ring-timeline",{
			timeRemap: [
				{
					time: 200,
					value: 200
				},
				{
					time: 300,
					value: 400
				}
			]
		});

		ringTimeline.addChild(ringTween, {fillMode: Timeline.FILL_MODE.NONE, loop: false, time: 200 });
		ringTimeline.addChild(ringTween, {fillMode: Timeline.FILL_MODE.BOTH, loop: false, time: 200 });

		const rootTimeline = new Timeline("root-timeline");

		rootTimeline.addChild(ringTimeline, {fillMode: Timeline.FILL_MODE.NONE, loop: false, time: 0 });

		state = rootTimeline._getState(0);
		expect(state.children[0].children[0].properties.radius).toBeNull();
		expect(state.children[0].children[1].properties.radius).toEqual(70);

		state = rootTimeline._getState(200);
		expect(state.children[0].children[0].properties.radius).toEqual(70);
		expect(state.children[0].children[1].properties.radius).toEqual(70);

		state = rootTimeline._getState(250);
		expect(state.children[0].children[0].properties.radius).toEqual(44.5);
		expect(state.children[0].children[1].properties.radius).toEqual(44.5);

		state = rootTimeline._getState(300);
		expect(state.children[0].children[0].properties.radius).toEqual(19);
		expect(state.children[0].children[1].properties.radius).toEqual(19);

		state = rootTimeline._getState(400);
		expect(state.children[0].children[0].properties.radius).toBeNull();
		expect(state.children[0].children[1].properties.radius).toEqual(19);
	});
});
