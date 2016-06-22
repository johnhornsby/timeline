# Timeline
Agnostic logic for managing a timeline, adding keyframes and tweening between them.

Travis CI Status: [![Build Status](https://travis-ci.org/johnhornsby/timeline.svg?branch=master)](https://travis-ci.org/johnhornsby/timeline)

I built this timeline library to help me establish some order, flexibility and efficiency when needing to animate a bunch of choreographed properties. It's functionality draws from animation tools such as After Effects as well as other bits and pieces such as CSS Animation.


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

## Tween

The basic building block at the root of any animation is the Tween. A Tween instance allows you to add multiple arbitrary properties and their related key frames. The keyframe objects at their simplest should specify a time and value. The Tween then can be called upon to interpolate or 'tween' between these keyfames. These properties and values are returned via a TimelineState object. The Tween is essentially your After Effects layer.


## Timeline

The Timeline extends the basic tween and basically becomes a container to host multiple Tweens and also other Timelines providing a mechanism to nest and build complexity. As Tweens are added to the Timeline a number of options can be specified to how they are positioned and behave within the Timeline.
