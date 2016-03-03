
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
		const propertyKeyframes = {
			radius: [
				{
					value: 0,
				 	time: 0,
				 	animatorType: MotionTween.animatorType.cubicBezier,
					animatorOptions: {
						controlPoints: [.15, .66, .83, .67]
					}
				},
				{
					value: 50,
				 	time: 250,
				 	hold: false,
				 	animatorType: MotionTween.animatorType.cubicBezier,
					animatorOptions: {
						controlPoints: [.15, .66, .83, .67]
					}
				},
				{
					value: 0,
					time: 500
				}]
		}

		const tween = new Tween("ball");

		tween.addKeyframes(propertyKeyframes);

		const timeline = new InteractiveTimeline("park");

		timeline.addChild(tween, {
			fillMode: "both",
			in: 0,
			loop: false,
			out: null,
			time: 0
		});

		const sequences = [
			{
				time: 0,
				duration: 500,
				label: "loop",
				next: "loop"
			}
		];

		timeline.setSequences(sequences);

		this._timeline = timeline;

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

		for (let i = 0; i < state.children.length; i++) {
			if (state.children[i].type === "tween" && state.children[i].name === "ball") {
				this._drawCircle(state.children[i].properties.radius);
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
