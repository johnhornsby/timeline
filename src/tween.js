
const _DEFAULT_OPTIONS = {
	loop: false,
	in: 0,
	out: null,
	duration: null,
	scale: 1
};

export default class Tween {




	constructor(propertyKeyframes, identifier, options) {

		this._propertyKeyframesMap = null;

		this._identifier = null;

		this._options = null;

		this._init(propertyKeyframes, identifier, options);
	}


	getState(time) { return this._getState(time); }

	get propertyKeyframesMap() { return this._propertyKeyframesMap; }

	get identifier() { return this._identifier; }

	get duration() { return this._duration; }



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
			this._propertyKeyframesMap.set(key, propertyKeyframes[key])
		});
	}


	_updateDuration() {
		this._duration = 0;

		this._propertyKeyframesMap.forEach((keyframes, key) => {
			keyframes.forEach((keyframe, index) => {
				this._duration = Math.max(this._duration, keyframe.time);
			});
		});
	}


	_getState(time) {
		if (this._loop) {
			// wrap time
			time = ((time % this._duration) + this._duration) % this._duration;
		}

		const propertiesStateObject = {};

		this._propertyKeyframesMap.forEach((keyframes, property) => {
			propertiesStateObject[property] = this._getTweenValue(keyframes, time);
		});

		return propertiesStateObject;
	}


	_getTweenValue(keyframes, time) {
		let value;
		// interate over keyframes untill we find the exact value or keyframes either side
		const length = keyframes.length;
		let keyframe, keyframeValue;
		let lastKeyframe;
		for (let i = 0; i < length; i++) {
			keyframe = keyframes[i];
			keyframeValue = keyframe.value;
			if (time === keyframe.time) { 
				// time matches keyframe exactly
				value = keyframeValue;
				break;
			} else if (time > keyframe.time) {

				if (this._loop && length > 1 && i === length - 1) {
					// if time is beyond the last keyframe && if the keyframe is not the only one then tween between last and first
					const firstKeyframe = keyframes[0]
					value = this._tweenBetweenKeyframes(keyframe, firstKeyframe, time);
					break;
				} else {
					// time is beyond keyframe, save as last and move on
					value = keyframeValue;
					lastKeyframe = keyframe;
				}
			} else if (time < keyframe.time) {
				if (i === 0) {
					// if next keyframe is not the only one then tween between last and first
					if (this._loop && length > 1) {
						lastKeyframe = keyframes[length -1];
						value = this._tweenBetweenKeyframes(lastKeyframe, keyframe, time);
					} else {
						// first keyframe time is beyond keyframe.time, use this value
						value = keyframeValue;
					}
					break;
				} else {
					// we have now clarified that the time is between two keyframes, this is where we tween
					value = this._tweenBetweenKeyframes(lastKeyframe, keyframe, time);
					break;
				}
			}
		}
		return value;
	}
  
  
	_tweenBetweenKeyframes(lastKeyframe, keyframe, time) {
		let timeDifference = (keyframe.time - lastKeyframe.time);
		let deltaFloat = (time - lastKeyframe.time) / timeDifference;

		if (keyframe.time < lastKeyframe.time) {
			// we are looping and needing to use the last keyframe as lastKeyframe
			timeDifference = (this._duration - lastKeyframe.time) + keyframe.time;

			if (time < lastKeyframe.time) {
				// time is less that the last keyframe.time and requires the difference 
				// between the last keyframe.time and the duration to be taken into account
				deltaFloat = ((this._duration - lastKeyframe.time) + time) / timeDifference;
			} else {
				deltaFloat = (time - lastKeyframe.time) / timeDifference;
			}
		}

		const valueDifference = (keyframe.value - lastKeyframe.value);
		const tweenedValue = lastKeyframe.value + (valueDifference * deltaFloat);

		return tweenedValue;
	}
}