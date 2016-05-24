// import MotionTween from 'motion-tween';
var MotionTween = require('motion-tween');
var Tween = require('../tween');

describe('_init', () => {
	it('instantiates a tween instance', () => {

		const tweenA = new Tween("A");

		expect(function() {
			new Tween()
		}).toThrow(Error("Name not specified"));

	});
});


describe('get name', () => {
	it('returns name passed in through constructor', () => {

		const tweenA = new Tween("A");

		expect(tweenA.name).toBe("A");

	});
});


describe('_tweenBetweenKeyframes', () => {
	it('return a value tweened between two keyframes dependant on time', () => {

		let result;

		const keyframes = {
			radius: [
				{
					time: 0,
					value: 0,
					animatorType: MotionTween.animatorType.cubicBezier,
					animatorOptions: {
						controlPoints: [0, 0.75, 0.25, 1]
					}
				},
				{
					time: 1000,
					value: 50
				},
				{
					time: 2000,
					value: 100
				}
			]
		}

		const tween = new Tween("test");

		result = tween._tweenBetweenKeyframes(keyframes['radius'][0], keyframes['radius'][1], 750);
		expect(result).toBeCloseTo(47.4609375, 1);

		result = tween._tweenBetweenKeyframes(keyframes['radius'][0], keyframes['radius'][1], 1000);
		expect(result).toEqual(50);

		result = tween._tweenBetweenKeyframes(keyframes['radius'][1], keyframes['radius'][2], 1500);
		expect(result).toEqual(75);
	});
});


describe('duration', () => {
	it('return the total duration of tween', () => {

		let result;

		const keyframes = {
			radius: [
				{
					time: 1000,
					value: 0
				},
				{
					time: 2000,
					value: 100
				}
			]
		}

		const tween = new Tween("test", keyframes);

		result = tween.duration;
		expect(result).toEqual(2000);

		tween.addKeyframes({
			"stroke": [
				{
					time: 500,
					value: 1
				},
				{
					time: 2500,
					value: 0
				}
			]
		})

		result = tween.duration;
		expect(result).toEqual(2500);
	});
});


describe('getState', () => {
	it('returns the state of the tween at a given time', () => {

		let tweenState, radius, stroke;

		const keyframes = {
			radius: [
				{
					time: 1000,
					value: 0
				},
				{
					time: 2000,
					value: 100
				}
			],
			"stroke": [
				{
					time: 500,
					value: 1
				},
				{
					time: 2500,
					value: 0
				}
			]
		}

		const tween = new Tween("test", keyframes);

		tweenState = tween.getState(750);

		radius = tweenState.properties.radius;
		stroke = tweenState.properties.stroke;

		expect(radius).toEqual(0);
		expect(stroke).toEqual(0.875);


		tweenState = tween.getState(0);

		radius = tweenState.properties.radius;
		stroke = tweenState.properties.stroke;

		expect(radius).toEqual(0);
		expect(stroke).toEqual(1);


		tweenState = tween.getState(3000);

		radius = tweenState.properties.radius;
		stroke = tweenState.properties.stroke;

		expect(radius).toEqual(100);
		expect(stroke).toEqual(0);

	});
});
