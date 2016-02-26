

const TIMELINE_DEFAULT_OPTIONS = {
	loop: false,
	fps: 60
}


export default class Timeline {

	_currentTime = 0;

	_loop = null;

	_options = null;

	_duration = null;

	// An Array of Objects {tween, time}
	_tweens = [];

	// tally of un named instance, allow easy generation of new instance names
	_unnamedInstances = 0;

	constructor(options) {

		this._init(options);
	}






	/*________________________________________________________

	PUBLIC CLASS METHODS
	________________________________________________________*/

	[Symbol.iterator]() { return this; }

	next() { return this._next(); }

	addTween(tween, time, instanceName) { this._addTween(tween, time, instanceName); }
	
	getState(time) { return this._getState(time); }

	set duration(duration) { this._duration = this._options.duration = duration; }

	get duration() { return this._duration; }
	
	set loop(boolean) { this._loop = boolean; }

	get loop() { return this._loop; }

	set currentTime (time) { this._currentTime = time; }

	get currentTime () { return this._currentTime; }







	/*________________________________________________________

	PRIVATE CLASS METHODS
	________________________________________________________*/

	_init(options) {
		this._options = {
			...TIMELINE_DEFAULT_OPTIONS,
			...options
		};
	}
	

	_addTween(tween, time = 0, instanceName = null) {
		const o = {
			tween,
			time,
			instanceName
		}

		if (instanceName == null && (tween.identifier == null || tween.identifier === "")) {
			throw Error("Tween can't be added without an valid String identifier!");
		}

		let instanceCount = 1;
		for (let i = 0; i < this._tweens.length; i++) {
			if (this._tweens[i].tween === tween) {
				instanceCount += 1;
			}
		}

		let insertIndex = this._tweens.length;
		let instanceCountString = "";

		if (instanceName != null) {
			// check if we already an instance of that name
			for (let i = 0; i < this._tweens.length; i++) {
				// if so then replace
				if (this._tweens[i].instanceName === instanceName) {
					insertIndex = i;
					break;
				}
			}
		} else {
			if (instanceCount > 1) {
				instanceCountString = String(instanceCount);
			}
			o.instanceName = `${tween.identifier}${instanceCountString}`;

		}

		this._tweens[insertIndex] = o;
		this._updateDuration();

	}

	
	_updateDuration() {
		 this._duration = 0;
			this._tweens.forEach((tweenObjectData, index) => {
				this._duration = Math.max(this._duration, tweenObjectData.time + tweenObjectData.tween.duration);
			});
	}
	
	
	_getState(time) {
		const stateMap = new Map();
		// iterate over map properies
		this._tweens.forEach((tweenObjectData, index) => {
			// interate over object properties
			stateMap.set(tweenObjectData.instanceName, tweenObjectData.tween.getState(time - tweenObjectData.time));
		}); 
		// return map
		return stateMap;
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
