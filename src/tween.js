import MotionTween from 'motion-tween';



const _DEFAULT_OPTIONS = {
	loop: false,
	in: 0,
	out: null,
	duration: null,
	fillMode: 0
};


export default class Tween {


	static FILL_MODE = {
		NOME: 0,
		FORWARD: 1,
		BACKWARD: 2,
		BOTH: 3
	};


	_propertyKeyframesMap = null;

	_identifier = null;

	_options = null;


	constructor(propertyKeyframes, identifier, options) {



		this._init(propertyKeyframes, identifier, options);
	}






	/*________________________________________________________

	PUBLIC CLASS METHODS
	________________________________________________________*/

	getState(time) { return this._getState(time); }

	get propertyKeyframesMap() { return this._propertyKeyframesMap; }

	get identifier() { return this._identifier; }

	get duration() { return this._options.duration; }

	get in() { return this._options.in; }

	get out() { return this._options.out; }

	get loop() { return this._options.loop; }

	get fillMode() { return this._options.fillMode; }






	/*________________________________________________________

	PRIVATE CLASS METHODS
	________________________________________________________*/

	_init(propertyKeyframes, identifier, options) {
		this._options = {
			..._DEFAULT_OPTIONS,
			...options
		};


		this._identifier = identifier;

		this._processProperties(propertyKeyframes);

		this._updateDuration();
	}


	_processProperties(propertyKeyframes) {
		this._propertyKeyframesMap = new Map();

		Object.keys(propertyKeyframes).map((key, index) => {
			

			const keyframes = this._validateKeyframes(propertyKeyframes[key]);

			this._propertyKeyframesMap.set(key, keyframes);
		});
	}


	_validateKeyframes(keyframes) {

		const keyframesCloned = keyframes.map((keyframe) => {
			return {...keyframe}
		});

		return keyframesCloned;
	}


	_updateDuration() {
		let duration = 0;
		let inIndex = -1;

		this._propertyKeyframesMap.forEach((keyframes, key) => {
			keyframes.forEach((keyframe, index) => {
				duration = Math.max(duration, keyframe.time);
			});
		});

		if (this._options.in == null) {
			this._options.in = 0;
		} else {
			// adjust the duration
			if (this._options.in > this._duration) {
				throw Error("In point is set beyond the end of the tween!");
			}
			duration -= this._options.in;
		}

		if (this._options.out != null && this._options.duration != null) {
			throw Error("specify either and out time or duration, not both!");
		}

		if (this._options.duration != null) {
			this._options.out = this._options.in + this._options.duration;
			duration = this._options.duration;
		}


		if (this._options.out != null) {
			duration = this._options.out - this._options.in;
		} else {
			this._options.out = this._options.in + duration;
		}

		this._options.duration = duration;

		if (this._options.in > this._options.out) {
			throw Error("tween in is greater than out!");
		}
	}


	_searchForKeyframeByTime() {

	}


	_getState(time) {

		const propertiesStateObject = {};

		time = this._resolveTime(time);
		
		this._propertyKeyframesMap.forEach((keyframes, property) => {

			propertiesStateObject[property] = this._getTweenValue(keyframes, time);
		});

		return propertiesStateObject;
	}


	_loopTime(time) {
		return (((time - this._options.in) % this._options.duration) + this._options.duration) % this._options.duration;
	}


	_resolveTime(time) {
		// resolve time
		if (time < this._options.in) {
			if (this._options.fillMode === Tween.FILL_MODE.BACKWARD || this._options.fillMode === Tween.FILL_MODE.BOTH) {
				if (this._options.loop) {
					return this._loopTime(time);
				}
			}
		}

		if (time > this._options.out) {
			if (this._options.fillMode === Tween.FILL_MODE.FORWARD || this._options.fillMode === Tween.FILL_MODE.BOTH) {
				if (this._options.loop) {
					return this._loopTime(time);
				}
			}
		}

		return time;
	}


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
  
  
	_tweenBetweenKeyframes(lastKeyframe, keyframe, time) {
		let timeDifference = (keyframe.time - lastKeyframe.time);
		let deltaFloat = (time - lastKeyframe.time) / timeDifference;

		if (keyframe.time < lastKeyframe.time) {
			// we are looping and needing to use the last keyframe as lastKeyframe
			timeDifference = (this._options.duration - lastKeyframe.time) + keyframe.time;

			if (time < lastKeyframe.time) {
				// time is less that the last keyframe.time and requires the difference 
				// between the last keyframe.time and the duration to be taken into account
				deltaFloat = ((this._options.duration - lastKeyframe.time) + time) / timeDifference;
			} else {
				deltaFloat = (time - lastKeyframe.time) / timeDifference;
			}
		}

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
