import Timeline from "../../dist/timeline";
import Tween from "../../src/tween";

class Main {

	constructor() {

		this._init();
	}


	_init() {
		const timeline = new Timeline();

		// var tween = new Map();
		// tween.set("test1", {
		//   x: [{
		//         value: 0,
		//         time: 200
		//       },
		//       {
		//         value: 50,
		//         time: 500
		//       },
		//      {
		//        value: 400,
		//        time: 1000
		//      }]
		// });


		// timeline.addTweenLayer(tween);
		// timeline.loop = true;
		// timeline.duration = 1400;
		// const xValue = timeline.getState(100).get("test1").x;
		// console.log(timeline.duration, xValue);



		const propertyKeyframes = {
			x: [{ value: 0, time: 200 }, { value: 50, time: 500 }, { value: 400, time: 1000 }]
		}

		const t = new Tween(propertyKeyframes, "test2", {});

		timeline.addTween(t);

		const xValue = timeline.getState(350).get("test2").x;
		console.log(xValue);

		console.dir(t.getState(350));

	}
}

new Main();