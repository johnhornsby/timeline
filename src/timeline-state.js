export default class TimelineState {


	static TYPE = {
		TWEEN: "tween",
		TIMELINE: "timeline"
	};


	_type = TimelineState.TYPE.TWEEN;

	_children = null;

	_properties = null;

	_name = null;


	constructor(type, name) {
		this._type = type;
		this._name = name;

		this._properties = {};

		if (this._type == TimelineState.TYPE.TIMELINE) {
			this._children = [];
		}
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
		// if (this._type !== TimelineState.TYPE.TIMELINE) {
		// 	throw Error("TimelineState instance is not of type Timeline and there does not have children!");
		// }
		return this._children;
	}


	get properties() { 
		// if (this._type !== TimelineState.TYPE.TWEEN) {
		// 	throw Error("TimelineState instance is not of type Tween and there does not have properties!");
		// }
		return this._properties;

	}
}
