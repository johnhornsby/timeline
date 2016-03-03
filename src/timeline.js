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
			o.settings.out = options.time + child.duration;
		}

		this._children.push(o);

		const absoluteDuration = this._getChildrenDuration();

		this._duration = absoluteDuration;
	}


	_removeChild() {

	}

	
	_getChildrenDuration() {
		let duration = 0;

		this._children.forEach((childObjectData, index) => {

			duration = Math.max(duration, childObjectData.settings.out);
	
		});

		return duration;
	}
	
	
	_getState(time) {
		let state = new TimelineState(TimelineState.TYPE.TIMELINE, this._name);
		let tweenState;

		let resolvedTime

		this._children.forEach((childObjectData, index) => {

			// loop is accounted for here, fill is automatically built into tween
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
	_loopTime(time, childSettings) {
		const childEditDuration = childSettings.out - childSettings.in;
		const realativeTime = time - childSettings.in;
		const loopedTime = (((realativeTime) % childEditDuration) + childEditDuration) % childEditDuration;
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
		// now we have the beginning position of the child we can determine the time relative to the child
		const childRelativeTime = time - childSettings.time;
		
		if (time < childSettings.in) {
			if (childSettings.fillMode === Timeline.FILL_MODE.BACKWARD || childSettings.fillMode === Timeline.FILL_MODE.BOTH) {

				if (childSettings.loop) {
					return this._loopTime(time, childSettings) - childSettings.time;
				} else {
					return childSettings.in - childSettings.time;
				}
			} else {
				return undefined;
			}
		}

		if (time > childSettings.out) {
			if (childSettings.fillMode === Timeline.FILL_MODE.FORWARD || childSettings.fillMode === Timeline.FILL_MODE.BOTH) {
				if (childSettings.loop) {
					return this._loopTime(time, childSettings) - childSettings.time;
				} else {
					return childSettings.out - childSettings.time;
				}
			} else {
				return undefined;
			}
		}

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
