import TimelineState from './timeline-state';
import Tween from './tween'

const _TIMELINE_DEFAULT_OPTIONS = {
	fps: 60
}

const _CHILD_DEFAULT_OPTIONS = {
	fillMode: "both",
	in: 0,
	loop: false,
	out: null,
	time: 0
}


export default class Timeline extends Tween {

	static FILL_MODE = {
		NOME: "none",
		FORWARD: "forward",
		BACKWARD: "backward",
		BOTH: "both"
	};


	// An Array of Objects {tween, time}
	_children = [];

	_currentTime = 0;


	constructor(name, options) {
		super(name);
	}






	/*________________________________________________________

	PUBLIC CLASS METHODS
	________________________________________________________*/

	[Symbol.iterator]() { return this; }

	next() { return this._next(); }

	addChild(child, options) { this._addChild(child, options); }

	set currentTime (time) { this._currentTime = time; }

	get currentTime () { return this._currentTime; }

	get duration() { return this._duration; }





	/*________________________________________________________

	PRIVATE CLASS METHODS
	________________________________________________________*/

	_init(name, options) {
		super._init(name);

		this._options = {
			..._TIMELINE_DEFAULT_OPTIONS,
			...options
		};
	}
	

	_addChild(child, options) {
		// clone options into settings property
		const o = {
			child,
			settings: {...options}
		}

		// set out property if not already set
		if (options.out == null) {
			o.settings.out = child.duration;
		}

		this._children.push(o);

		const absoluteDuration = this._getChildrenDuration();

		this._duration = absoluteDuration;

		// this._updateRelativeDuration(absoluteDuration);
	}


	_removeChild() {

	}

	
	_getChildrenDuration() {
		let duration = 0;

		this._children.forEach((childObjectData, index) => {

			duration = Math.max(duration, childObjectData.settings.time + (childObjectData.settings.out - childObjectData.settings.in));
	
		});

		return duration;
	}
	
	
	_getState(time) {
		const state = new TimelineState(TimelineState.TYPE.TIMELINE, this._name);
		let tweenState;

		let resolvedTime

		this._children.forEach((childObjectData, index) => {

			// @TODO resolve our time according to our tween settings
			resolvedTime = this._resolveChildRelativeTime(time, childObjectData.settings);

			tweenState = childObjectData.child.getState(resolvedTime);

			state.addChild(tweenState);
		});

		return state;
	}



	/**
	 * Method takes any time and wraps it accordingly to be within in and out points
	 *
	 * @private
	 * @param {Number} time Time in milisecond
	 * @return Number
	 */
	_loopTime(childTime, childSettings) {
		const duration = childSettings.out - childSettings.in;
		const time = childTime - childSettings.in;
		const loopedTime = (((time) % duration) + duration) % duration;
		return childSettings.in + loopedTime;
	}


	/**
	 * Method takes any time and checks whether the time value requires wrapping, if so then returns wrapped time
	 *
	 * @private
	 * @param {Number} time Time in milisecond
	 * @return Number
	 */
	_resolveChildRelativeTime(time, childSettings) {

		// time position within the timeline
		const childAbsoluteX = childSettings.time - childSettings.in;
		// now we have the beginning position of the child we can determine the time relative to the child
		const childRelativeTime = time - childAbsoluteX;
		
		if (childRelativeTime < childSettings.in) {
			if (childSettings.fillMode === Timeline.FILL_MODE.BACKWARD || childSettings.fillMode === Timeline.FILL_MODE.BOTH) {
				if (childSettings.loop) {
					return this._loopTime(childRelativeTime, childSettings);
				}
			}
		}

		if (childRelativeTime > childSettings.out) {
			if (childSettings.fillMode === Timeline.FILL_MODE.FORWARD || childSettings.fillMode === Timeline.FILL_MODE.BOTH) {
				if (childSettings.loop) {
					return this._loopTime(childRelativeTime, childSettings);
				}
			}
		}

		// time = 200
		// settings.in = 100
		// settings.time = 150

		// settings.time - settings.in = -50
		// childRelativeTime = time - -50 = 250


		// if (time < this._options.in) {
		// 	if (this._options.fillMode === TimelineAbstract.FILL_MODE.BACKWARD || this._options.fillMode === TimelineAbstract.FILL_MODE.BOTH) {
		// 		if (this._options.loop) {
		// 			return this._loopTime(time);
		// 		}
		// 	}
		// }

		// if (time > this._options.out) {
		// 	if (this._options.fillMode === TimelineAbstract.FILL_MODE.FORWARD || this._options.fillMode === TimelineAbstract.FILL_MODE.BOTH) {
		// 		if (this._options.loop) {
		// 			return this._loopTime(time);
		// 		}
		// 	}
		// }

		return childRelativeTime;
	}


	_next() {
		let time = this._currentTime;

		this._currentTime += (1000 / this._options.fps);

		let done = time >= this._duration;

		if (done) {
			this._currentTime = 0;
			return {done}

		} else {
			return {
				value: this._getState(time)
			}
		}
	}

}             
