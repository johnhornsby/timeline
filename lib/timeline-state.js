"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimelineState = (function () {
	_createClass(TimelineState, null, [{
		key: "TYPE",
		value: {
			TWEEN: "tween",
			TIMELINE: "timeline"
		},
		enumerable: true
	}]);

	function TimelineState(type, name) {
		_classCallCheck(this, TimelineState);

		this._type = TimelineState.TYPE.TWEEN;
		this._children = null;
		this._properties = null;
		this._name = null;

		this._type = type;
		this._name = name;

		this._properties = {};

		if (this._type == TimelineState.TYPE.TIMELINE) {
			this._children = [];
		}
	}

	_createClass(TimelineState, [{
		key: "addProperty",
		value: function addProperty(key, value) {
			this._properties[key] = value;
		}
	}, {
		key: "addChild",
		value: function addChild(timelineStateInstance) {
			this._children.push(timelineStateInstance);
		}
	}, {
		key: "type",
		get: function get() {
			return this._type;
		}
	}, {
		key: "name",
		get: function get() {
			return this._name;
		}
	}, {
		key: "children",
		get: function get() {
			// if (this._type !== TimelineState.TYPE.TIMELINE) {
			// 	throw Error("TimelineState instance is not of type Timeline and there does not have children!");
			// }
			return this._children;
		}
	}, {
		key: "properties",
		get: function get() {
			// if (this._type !== TimelineState.TYPE.TWEEN) {
			// 	throw Error("TimelineState instance is not of type Tween and there does not have properties!");
			// }
			return this._properties;
		}
	}]);

	return TimelineState;
})();

exports["default"] = TimelineState;
module.exports = exports["default"];