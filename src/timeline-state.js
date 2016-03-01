export default class TimelineState {


	static TYPE = {
		TWEEN: 0,
		TIMELINE: 1
	};


	_type = TimelineState.TYPE.TWEEN;

	_children = [];

	_properties = {};

	_name = null;


	constructor(type, name) {
		this._type = type;
		this._name = name;
	}


	addProperty(key, value) {
		this._properties[key] = value;
	}


	addChild(timelineStateInstance) {
		this._children.push(timelineStateInstance);
	}


	get type() {
		return this._type;
	}


	get name() {
		return this._name;
	}


	get children() { 
		if (this._type !== TimelineState.TYPE.TIMELINE) {
			throw Error("TimelineState instance is not of type Timeline and there does not have children!");
		}
		return this._children;
	}


	get properties() { 
		if (this._type !== TimelineState.TYPE.TWEEN) {
			throw Error("TimelineState instance is not of type Tween and there does not have properties!");
		}
		return this._properties;

	}
}
