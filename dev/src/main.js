
import {Timeline, Tween, MotionTween} from "../../dist/timeline";

class Main {

	constructor() {

		this._init();
	}


	_init() {
		const timeline = new Timeline();

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
					value: 50,
					time: 500,
					// animatorType: MotionTween.animatorType.cubicBezier,
					// animatorOptions: {
					// 	controlPoints: [.15, .66, .83, .67]
					// }
				}]
		}

		const t = new Tween(propertyKeyframes, "test2", {
			loop: true,
			fillMode: 0
		});

		timeline.addTween(t, 100);

		const xValue = timeline.getState(350).get("test2").x;
		console.log(xValue);

		for (let state of timeline) {
			console.dir(state);
		}


	}
}

new Main();
