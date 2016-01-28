
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


	getState(time) { return this._getState(time); }

	get propertyKeyframesMap() { return this._propertyKeyframesMap; }

	get identifier() { return this._identifier; }

	get duration() { return this._options.duration; }



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
			return {...keyframe,
				type: "external"
			}
		});

		// have we an initial keyframe, if not then inset an internal one
		if (keyframesCloned[0].time !== 0) {
			keyframesCloned.unshift({
				value: keyframesCloned[0].value,
				time: 0,
				type: "internal-start"
			});
		}

		return keyframesCloned;
	}


	_updateDuration() {
		let keyframeDuration = 0;
		let inIndex = -1;

		this._propertyKeyframesMap.forEach((keyframes, key) => {
			keyframes.forEach((keyframe, index) => {
				keyframeDuration = Math.max(keyframeDuration, keyframe.time);
			});
		});

		if (this._options.in == null) {
			this._options.in = 0;
		} else {

			//@ we need to check for loop before we extrapolate the next or previous keyframe value, if we are looping and
			// or there is one before we need to tween this value. only extrapolate if no loop and no before.

			// we need to use the getTweenValue but force it to ignore the in and out points.
			// check to actualy see if this matters. 

			this._propertyKeyframesMap.forEach((keyframes, key) => {
				for (let i = 0; i < keyframes.length; i++) {
					if (this._options.in === keyframes[i].time) {
						// no need to insert
						break;
					} else if (this._options.in < keyframes[i].time) {
						keyframes.splice(i, 0, {
							value: keyframes[i].value,
							time: this._options.in,
							type: "internal-in"
						});
						break;
					}
				}
			});

		}

		if (this._options.out != null && this._options.duration != null) {
			throw Error("specify either and out time or duration, not both!");
		}

		if (this._options.duration != null) {
			this._options.out = this._options.in + this._options.duration;
		} else {
			this._options.duration = keyframeDuration;
		}

		if (this._options.out != null) {
			this._options.duration = this._options.out - this._options.in;

			this._propertyKeyframesMap.forEach((keyframes, key) => {
				for (let i = keyframes.length - 1; i > -1; i--) {
					if (this._options.out === keyframes[i].time) {
						// no need to insert
						break;
					} else if (this._options.out > keyframes[i].time) {
						keyframes.splice(i, 0, {
							value: keyframes[i].value,
							time: this._options.out,
							type: "internal-out"
						});
						break;
					}
				}
			});
		} else {
			this._options.out = this._options.in + this._options.duration;
		}

		if (this._options.in > this._options.out) {
			throw Error("tween in is greater than out!");
		}
	}


	_searchForKeyframeByTime() {

	}


	_getState(time) {

		const propertiesStateObject = {};

		this._propertyKeyframesMap.forEach((keyframes, property) => {
			propertiesStateObject[property] = this._getTweenValue(keyframes, time);
		});

		return propertiesStateObject;
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
				previousKeyframe = nextKeyframe = keyframe;
				break; // break here as we have found all we need
			} else if (time > keyframe.time && keyframe.time > this._options.in){
				previousKeyframe = keyframe;
				// no need to break here as we continue iterating through keyFrames to find the keyframe just previous to the time value
			} else if (time < keyframe.time && keyframe.time < this._options.out) {
				nextKeyframe = keyframe;
				break; // break here has we have gone far enough to get the next keyFrame
			}
		}

		// If previous or next are null then the time specified is outside of the tween range

		if (time > this._options.out) {
			if (this._options.fillMode === Tween.FILL_MODE.FORWARD || this._options.fillMode === Tween.FILL_MODE.BOTH) {
				if (this._options.loop) {
					// wrap the time and recurcively call _getTweenValue with valid wrapped time

					time = (((time - this._options.in) % this._options.duration) + this._options.duration) % this._options.duration;

					value = this._getTweenValue(keyframes, time);

				} else {
					// no loop then aquire the last keyframe within in and out? maybe use the internal out keyframe
					value = keyframes[length - 1].value;
				}
			} else {
				// RETURN NULL FOR VALUE
			}
		} else if (time < this._options.in) {
			if (this._options.fillMode === Tween.FILL_MODE.BACKWARD || this._options.fillMode === Tween.FILL_MODE.BOTH) {
				if (this._options.loop) {
					// wrap the time and call _getTweenValue with valid wrapped time
					time = (((time - this._options.in) % this._options.duration) + this._options.duration) % this._options.duration;

					value = this._getTweenValue(keyframes, time);

				} else {
					// no loop then aquire the first ketframe within in and out? maybe use the internal in keyframe
					value = keyframes[0].value;
				}
			} else {
				// RETURN NULL FOR VALUE
			}
		}

		if (previousKeyframe != null && nextKeyframe != null) {
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

		const valueDifference = (keyframe.value - lastKeyframe.value);
		const tweenedValue = lastKeyframe.value + (valueDifference * deltaFloat);

		return tweenedValue;
	}
}