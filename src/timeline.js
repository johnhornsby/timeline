import TimelineState from './timeline-state';
import Tween from './tween'

const _TIMELINE_DEFAULT_OPTIONS = {
	fps: 60
}

const _CHILD_DEFAULT_OPTIONS = {
	fillMode: "both",
	in: null,
	loop: false,
	out: null,
	time: null
}


export default class Timeline extends Tween {

	static FILL_MODE = {
		NONE: "none",
		FORWARD: "forward",
		BACKWARD: "backward",
		BOTH: "both"
	};


	_children = [];

	_currentTime = 0;


	constructor(name, keyframesObject, options) {
		super(name, keyframesObject, options);

		this._options = {
			..._TIMELINE_DEFAULT_OPTIONS,
			...options
		};
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

	_addChild(child, options) {
		// clone options into settings property
		const o = {
			child,
			settings: {
				..._CHILD_DEFAULT_OPTIONS,
				...options
			}
		}

		// set time property if not already set
		if (o.settings.time == null) {
			o.settings.time = 0;
		}

		// set in property if not already set
		if (o.settings.in == null) {
			o.settings.in = o.settings.time;
		}

		// set out property if not already set
		if (o.settings.out == null) {
			o.settings.out = o.settings.time + child.duration;
		}

		this._validateChildOptions(o.settings);

		this._children.push(o);

		const childDuration = this._getChildrenDuration();

		const localDuration = this._getKeyframesDuration()

		this._duration = Math.max(childDuration, localDuration);
	}


	_validateChildOptions(settings) {
		const fillModes = Object.keys(Timeline.FILL_MODE).map( (key) => Timeline.FILL_MODE[key]);

		if (fillModes.indexOf(settings.fillMode) === -1) {
			throw Error("Incorrectly set fillMode: " + settings.fillMode);
		}

		if (settings.in < settings.time) {
			throw Error("The 'in' option can't preceed the 'time' option");
		}

		if (settings.in > settings.out) {
			throw Error("The 'in' option can't be after the 'out' option");
		}

		if (settings.out < settings.time || settings.out < settings.in) {
			throw Error("The 'out' option can't preceed the 'time' or 'in' option");
		}
	}


	_removeChild() {
		// @TODO
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
		let tweenState, resolvedTime;

		// Check to see if we have specified the 'timeRemap' property,
		// if so remap time and then obtain state
		if (this._propertyKeyframesMap.size > 0) {
			if (this._propertyKeyframesMap.has("timeRemap")) {
				const keyframes = this._propertyKeyframesMap.get("timeRemap");

				// @TODO if time comes in here undefined then it is resolved to null,
				// where we usually expect an undefined to deliver us a null state property value
				// resolved time is returning as 0, and therefore we are not getting the correct state

				// 160619 this is now done, undefined in produces null out

				time = this._getTimeRemapTweenValue(keyframes, time);
			}
		}

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
		// brief check to see if the time is null or undefined, this may come as a result of attempting to obtain
		// a time outside of the parents range, previously below return 0 resulting in incorrect resolved time.
		if (time == null) {
			return time;
		}

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


	/**
	 * Method takes an array of timeRemap Keyframes and time and returns the tweened time at that time
	 *
	 * @private
	 * @param {Array} keyframes Array of keyframe objects with time and value properties.
	 * @param {Number} time Time in milisecond
	 * @return Number
	 */
	_getTimeRemapTweenValue(keyframes, time) {
		let value = null;
		// interate over keyframes untill we find the exact value or keyframes either side
		const length = keyframes.length;
		let keyframe, keyframeValue;
		let lastKeyframe;

		// the aim here is to find the keyframe to either side of the time value

		let previousKeyframe = null;
		let nextKeyframe = null;

		for (let i = 0; i < length; i++) {
			keyframe = keyframes[i];
			keyframeValue = keyframe.value;

			if (time === keyframe.time) {
				return keyframe.value;

			} else if (time > keyframe.time){
				previousKeyframe = keyframe;
				// no need to break here as we continue iterating through keyFrames to find the keyframe just previous to the time value
			} else if (time < keyframe.time) {
				nextKeyframe = keyframe;
				break; // break here has we have gone far enough to get the next keyFrame
			}
		}

		if (previousKeyframe == null && nextKeyframe == null) {
			return value;
		}

		if (previousKeyframe == null) {
			// when we have no previouskeyframe the natural behaviour differs from standard tween keyframes,
			// instead of gleening the next keyframe value, we want to determine the time relative to the
			// time remaped at the nextKeyframe value. Look at the example below

			// nextKeyframe.time = 50
			// nextKeyframe.value = 25
			// time = 30
			// value = nextKeyframe.value - (nextKeyframe.time - time) // ergo 5

			return nextKeyframe.value - (nextKeyframe.time - time);
		}

		if (nextKeyframe == null) {

			// see above reasoning

			// previousKeyframe.time = 50
			// previousKeyframe.value = 25
			// time = 70
			// value = previousKeyframe.value - (previousKeyframe.time - time) // ergo 45

			return previousKeyframe.value - (previousKeyframe.time - time);
		}

		if (previousKeyframe != null && nextKeyframe != null) {
			// check for a hold keyframe
			if (previousKeyframe.hold != null && previousKeyframe.hold === true) {
				return previousKeyframe.value;
			}

			value = this._tweenBetweenKeyframes(previousKeyframe, nextKeyframe, time);
		}

		return value;
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
