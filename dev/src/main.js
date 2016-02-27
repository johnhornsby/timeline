
import {InteractiveTimeline, Tween, MotionTween} from "../../dist/timeline";

class Main {

	constructor() {

		this._init();
	}


	_init() {
		const timeline = new InteractiveTimeline();

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

		const t = new Tween(propertyKeyframes, "simpleTest", {
			loop: true,
			fillMode: 0
		});

		timeline.addTween(t, 0);
		timeline.addTween(t, 0);


		const sequences = [
			{
				time: 0,
				duration: 250,
				label: "intro",
				next: "intro"
			},
			{
				time: 250,
				duration: 250,
				label: "outro",
				next: "outro"
			}
		];

		timeline.setSequences(sequences);


		// window.timeline = timeline;

		const xValue = timeline.getState(450).get("simpleTest").x;
		console.log(xValue);

		for (let state of timeline) {
			console.dir(state);
		}






	}
}

new Main();
