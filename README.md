# timeline
Agnostic logic for managing a timeline, adding keyframes and tweening between them.

[![Build Status](https://travis-ci.org/johnhornsby/timeline.svg?branch=master)](https://travis-ci.org/johnhornsby/timeline)



## Example

```javascript
import {Timeline, Tween} from "timeline";


const tween = new Tween('ring', {
	radius: [
		{
			time: 0,
			value: 0
		},
		{
			time: 900,
			value: 55
		},
		{
			time: 1000,
			value: 50
		}
	]
});

const timeline = new Timeline('ring-animation', {
	fps: 60
});

timeline.addChild(tween, {fillMode: Timeline.FILL_MODE.NONE, loop: false, time: 500 });

for(let state in timeline) {
	let radius = state.child[0].properties.radius;
	// @todo render radius
}

// or get the state of the timeline at any given point

const state = timeline.getState(150);
let radius = state.child[0].properties.radius;
// @todo render radius

```
