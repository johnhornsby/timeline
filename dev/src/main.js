import Timeline from "../../dist/timeline";

class Main {

	constructor() {

		this._init();
	}


	_init() {
		const timeline = new Timeline();

		var tween = new Map();
		tween.set("test1", {
		  x: [{
		        value: 0,
		        time: 200
		      },
		      {
		        value: 50,
		        time: 500
		      },
		     {
		       value: 400,
		       time: 1000
		     }]
		});


		timeline.addTweenLayer(tween);
		timeline.loop = true;
		timeline.duration = 1400;
		const xValue = timeline.getState(100).get("test1").x;
		console.log(timeline.duration, xValue);
	}
}

new Main();