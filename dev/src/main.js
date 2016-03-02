
import {Timeline, Tween, MotionTween} from "../../dist/timeline";

class Main {

	constructor() {

		this._init();
	}


	_init() {
		// const timeline = new InteractiveTimeline("root");

		const propertyKeyframes = {
			x: [
				{
					value: 0,
				 	time: 0,
				 // 	animatorType: MotionTween.animatorType.cubicBezier,
					// animatorOptions: {
					// 	controlPoints: [.15, .66, .83, .67]
					// }
				},
				{
					value: 100,
				 	time: 250,
				 	hold: false
				 // 	animatorType: MotionTween.animatorType.cubicBezier,
					// animatorOptions: {
					// 	controlPoints: [.15, .66, .83, .67]
					// }
				},
				{
					value: 50,
					time: 500,
					// animatorType: MotionTween.animatorType.cubicBezier,
					// animatorOptions: {
					// 	controlPoints: [.15, .66, .83, .67]
					// }
				}]
		}

		// const t = new Tween("simpleTest", {
		// 	loop: true,
		// 	fillMode: 0,
		// 	in: 50
		// });

		const tween = new Tween("ball");

		tween.addKeyframes(propertyKeyframes);

		const timeline = new Timeline("park");

		timeline.addChild(tween, {
			fillMode: "none",
			in: 500,
			loop: false,
			out: null,
			time: 250
		});

		// timeline.addChild(tween, {
		// 	fillMode: 3,
		// 	in: 250,
		// 	loop: false,
		// 	out: 400,
		// 	time: 250
		// });

		console.log(timeline.duration);
		console.dir(timeline.getState(750));


		// t.addKeyframes(propertyKeyframes);

		// timeline.addChild(t, 0);
		// timeline.addChild(t, 100);


		// const sequences = [
		// 	{
		// 		time: 0,
		// 		duration: 250,
		// 		label: "intro",
		// 		next: "intro"
		// 	},
		// 	{
		// 		time: 250,
		// 		duration: 250,
		// 		label: "outro",
		// 		next: "outro"
		// 	}
		// ];

		// timeline.setSequences(sequences);


		// window.timeline = timeline;

		// const xValue = timeline.getState(450).get("simpleTest").x;
		// console.log(xValue);

		// for (let state of timeline) {
		// 	console.dir(state);
		// }






	}
}

new Main();
