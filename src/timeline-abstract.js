const _DEFAULT_OPTIONS = {
	loop: false,
	in: 0,
	out: null,
	fillMode: 0
}


export default class TimelineAbstract {

	static FILL_MODE = {
		NOME: 0,
		FORWARD: 1,
		BACKWARD: 2,
		BOTH: 3
	};



	_options = null;

	_name = null;
	

	constructor(name, options) {

		this._init(name, options);
	}






	/*________________________________________________________

	PUBLIC CLASS METHODS
	________________________________________________________*/

	
	getState(time) { return this._getState(time); }

	get duration() { return this._duration; }

	get name() { return this._name; }

	get in() { return this._options.in; }

	get out() { return this._options.out; }

	get loop() { return this._options.loop; }

	get fillMode() { return this._options.fillMode; }






	/*________________________________________________________

	PRIVATE CLASS METHODS
	________________________________________________________*/

	_init(name, options) {


		this._validateOptions(options);

		this._options = {
			..._DEFAULT_OPTIONS,
			...options
		};

		this._name = name;
	}
	

	_validateOptions(options) {}


	_getState(time) {}


	/**
	 * Method iterates through keyframes for each property and determines our relative duration between in and out
	 *
	 * @private
	 */
	_updateRelativeDuration(absoluteDuration) {
		let inIndex = -1;
		let duration = absoluteDuration;

		if (this._options.in == null) {
			this._options.in = 0;
		} else {
			// adjust the duration
			if (this._options.in > duration) {
				throw Error("In point is set beyond the end of the tween!");
			}
			duration -= this._options.in;
		}

		if (this._options.out != null) {
			duration = this._options.out - this._options.in;
		} else {
			this._options.out = this._options.in + duration;
		}

		this._duration = duration;

		if (this._options.in > this._options.out) {
			throw Error("tween in is greater than out!");
		}
	}


	/**
	 * Method takes any time and wraps it accordingly to be within in and out points
	 *
	 * @private
	 * @param {Number} time Time in milisecond
	 * @return Number
	 */
	_loopTime(time) {
		return (((time - this._options.in) % this._duration) + this._duration) % this._duration;
	}


	/**
	 * Method takes any time and checks whether the time value requires wrapping, if so then returns wrapped time
	 *
	 * @private
	 * @param {Number} time Time in milisecond
	 * @return Number
	 */
	_resolveTime(time) {
		if (time < this._options.in) {
			if (this._options.fillMode === TimelineAbstract.FILL_MODE.BACKWARD || this._options.fillMode === TimelineAbstract.FILL_MODE.BOTH) {
				if (this._options.loop) {
					return this._loopTime(time);
				}
			}
		}

		if (time > this._options.out) {
			if (this._options.fillMode === TimelineAbstract.FILL_MODE.FORWARD || this._options.fillMode === TimelineAbstract.FILL_MODE.BOTH) {
				if (this._options.loop) {
					return this._loopTime(time);
				}
			}
		}

		return time;
	}
}             
