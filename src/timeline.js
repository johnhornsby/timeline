import TimelineState from './timeline-state';
import TimelineAbstract from './timeline-abstract'

const _TIMELINE_DEFAULT_OPTIONS = {
	fps: 60
}


export default class Timeline extends TimelineAbstract {


	// An Array of Objects {tween, time}
	_children = [];

	_currentTime = 0;


	constructor(name, options) {
		super(name, options);
	}






	/*________________________________________________________

	PUBLIC CLASS METHODS
	________________________________________________________*/

	[Symbol.iterator]() { return this; }

	next() { return this._next(); }

	addChild(child, time) { this._addChild(child, time); }

	set currentTime (time) { this._currentTime = time; }

	get currentTime () { return this._currentTime; }







	/*________________________________________________________

	PRIVATE CLASS METHODS
	________________________________________________________*/

	_init(name, options) {
		super._init(name, options);

		this._options = {
			..._TIMELINE_DEFAULT_OPTIONS,
			...this._options
		};
	}
	

	_addChild(child, time = 0) {
		const o = {
			child,
			time
		}

		this._children.push(o);

		const absoluteDuration = this._getAbsoluteDuration();

		this._updateRelativeDuration(absoluteDuration);
	}

	
	_getAbsoluteDuration() {
		let duration = 0;

		this._children.forEach((childObjectData, index) => {
			duration = Math.max(duration, childObjectData.time + childObjectData.child.duration);
		});

		return duration;
	}
	
	
	_getState(time) {
		const state = new TimelineState(TimelineState.TYPE.TIMELINE, this._name);
		let tweenState;

		this._children.forEach((childObjectData, index) => {
			tweenState = childObjectData.child.getState(time - childObjectData.time);
			state.addChild(tweenState);
		});

		return state;
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
