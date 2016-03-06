
import {InteractiveTimeline, Timeline, Tween, MotionTween} from "../../dist/timeline";

class Main {

	constructor() {

		// bind draw
		this._update = ::this._update;

		this._lastDrawInterval = null;

		this._timeline = null;

		this._init();
	}


	_init() {

		const tween = new Tween("ball", {
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
				}
				]
		});

		const timeline = new InteractiveTimeline("park", {
			timeRemap: [
				{
					time: 250,
					value: 500
				},
				{
					time: 500,
					value: 1000
				},
				{
					time: 750,
					value: 750
				}
			]
		});

		timeline.addChild(tween);

		const rootTimeline = new InteractiveTimeline("root");

		rootTimeline.addChild(timeline);


		const sequences = [
			{
				time: 0,
				duration: 1000,
				label: "loop",
				next: "loop"
			}
		];

		rootTimeline.setSequences(sequences);

		this._timeline = rootTimeline;

		this._build();
		this._update();
	}


	_build() {
		const canvas = document.createElement("canvas");
		canvas.width = 128;
		canvas.height = 128;
		document.body.appendChild(canvas);

		this._ctx = canvas.getContext("2d");
	}


	_update() {
		const now = new Date().getTime();
		let delta = 0;
		if (this._lastDrawInterval != null) {
			delta =	now - this._lastDrawInterval;
		}
		this._lastDrawInterval = now;

		this._draw(delta);
		window.requestAnimationFrame(this._update);
	}


	_draw(delta) {
		this._ctx.clearRect(0,0, 128, 128);

		const state = this._timeline.increment(delta);

		const tweens = state.children[0].children;

		for (let i = 0; i < tweens.length; i++) {
			if (tweens[i].type === "tween" && tweens[i].name === "ball") {
				this._drawCircle(tweens[i].properties.radius);
			}
		}
	}


	_drawCircle(radius) {
		this._ctx.beginPath();
		this._ctx.arc(64,64,radius,0,2*Math.PI);
		this._ctx.stroke();
	}
}

new Main();
