import MotionTween from 'motion-tween';
import TimelineState from './timeline-state';
import TimelineAbstract from './timeline-abstract'




export default class Tween {


	_propertyKeyframesMap = null;

	_options = null;

	_name = null;

	_duration = 0;


	constructor(name) {

		this._init(name);
	}






	/*________________________________________________________

	PUBLIC CLASS METHODS
	________________________________________________________*/

	addKeyframes(keyframesObject) { this._addKeyframes(keyframesObject); }

	getState(time) { return this._getState(time); }

	get duration() { return this._duration; }

	get name() { return this._name; }








	/*________________________________________________________

	PRIVATE CLASS METHODS
	________________________________________________________*/

	_init(name) {

		if (name == null) {
			throw Error("Name not specified");
		}

		this._name = name;

		this._propertyKeyframesMap = new Map();
	}


	_addKeyframes(keyframesObject) {
		let keyframes;

		Object.keys(keyframesObject).map((key, index) => {

			keyframes = this._cloneKeyframes(keyframesObject[key]);

			this._propertyKeyframesMap.set(key, keyframes);
		});

		this._duration = this._getKeyframesDuration();
	}


	/**
	 * Method clones the array of keyframes
	 *
	 * @private
	 * @param {Array} keyframes An Array of keyframe objects
	 * @returns Array
	 */
	_cloneKeyframes(keyframes) {
		const keyframesCloned = keyframes.map((keyframe) => {
			return {...keyframe}
		});

		return keyframesCloned;
	}


	_getKeyframesDuration() {
		let duration = 0;
		// the durationdetermined here is relative to the entire tween, yet to be clipped by in and out
		this._propertyKeyframesMap.forEach((keyframes, key) => {
			keyframes.forEach((keyframe, index) => {
				duration = Math.max(duration, keyframe.time);
			});
		});

		return duration;
	}


	/**
	 * Method calculates and returns the values for each property at the given time
	 *
	 * @private
	 * @param {Number} time Time in milisecond
	 * @return Object
	 */
	_getState(time) {
		const state = new TimelineState(TimelineState.TYPE.TWEEN, this._name);

		this._propertyKeyframesMap.forEach((keyframes, property) => {

			state.addProperty(property, this._getTweenValue(keyframes, time));
		});

		return state;

	}


	/**
	 * Method takes an array of Keyframes and time and returns the tweened value at that time
	 *
	 * @private
	 * @param {Array} keyframes Array of keyframe objects with time and value properties.
	 * @param {Number} time Time in milisecond
	 * @return Number
	 */
	_getTweenValue(keyframes, time) {
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
			return nextKeyframe.value;
		}

		if (nextKeyframe == null) {
			return previousKeyframe.value;
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
  
  	
  	/**
	 * Method calculates the value between two keyframes
	 *
	 * @private
	 * @param {Object} lastKeyframe left keyframe object
	 * @param {Object} keyframe right keyframe object
	 * @param {Number} time Time in milisecond
	 * @return Number
	 */
	_tweenBetweenKeyframes(lastKeyframe, keyframe, time) {
		// time difference between keyframes
		let timeDifference = (keyframe.time - lastKeyframe.time);
		// percentage float 0-1 of time through difference
		let deltaFloat = (time - lastKeyframe.time) / timeDifference;

		let easedDelta = deltaFloat;

		if (lastKeyframe.animatorType != null) {
			let animatorOptions = {};
			if (lastKeyframe.animatorOptions != null) {
				animatorOptions = {
					...animatorOptions,
					...lastKeyframe.animatorOptions
				}
			}

			easedDelta = MotionTween.getValue(lastKeyframe.animatorType, animatorOptions, deltaFloat);
		}

		const valueDifference = (keyframe.value - lastKeyframe.value);
		const tweenedValue = lastKeyframe.value + (valueDifference * easedDelta);

		return tweenedValue;
	}
}
