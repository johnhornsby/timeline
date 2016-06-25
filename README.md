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



##Tween

The basic building block at the root of any animation is the Tween. A Tween instance allows you to add multiple arbitrary properties and their related key frames. The keyframe objects at their simplest should specify a time and value. The Tween then can be called upon to interpolate or 'tween' between these keyfames. These properties and values are returned via a TimelineState object. The Tween is essentially your After Effects layer.



##Timeline

The Timeline extends the basic tween and basically becomes a container to host multiple Tweens and also other Timelines providing a mechanism to nest and build complexity. 


###addChild Options

As Child Tweens and Timelines are added to the parent Timeline a number of options can be specified to how they are positioned and behave within that parent Timeline.

time: The child's time option specifies the start position of the child on the parent Timeline. This time is relative to the parents Timeline.

fillMode: By default timeline state acquired with times outside the range of the Tween results in the property values returned as null. Setting the fillMode to FORWARD or BACKWARD extends the final or initial keyframe property values respectively. Setting to BOTH extends the keyframe properties in both directions. 

loop: When fillMode allows keyframe values to be extended beyond its range, setting loop to true, allows the keyframe values to loop through the extended period.

in: Adjusting the In point allows you to clip the start of the Tween. The In value should be relative to the parent timeline.

out: Adjusting the Out point  allows you to clip the end of the Tween or in fact extend it.


###Using TimelineState

When you want to get the state at a certain point in time, calling getState on a Tween or a Timeline returns a TimelineState object. The TimelineState object is returned in its simplest form when getting the state from a Tween. The object contains all the tweened properties at the time specified within the state objects 'properties' property.

When obtaining the state from a Timeline, the state represents the nested structured of the timeline and all its child Tweens and Timelines. The state of all the Timelines children will be contained in the state objects 'children' property. This is an array of Tween state objects or further nested Timeline states.

Having the state object organised as such, allows you to iterate through the the state programmatically down through all the nested timelines getting access finally to the tween state objects.


###Timeline Iteration

getState allows you to get the state of the Timeline at any given time. Calculating a time delta via RAF is useful option to acquiring the correct state properties at runtime, however the Timeline is also an Iterable and you can iterate over its state via a 'for of' loop. By default the Timeline advanced at 60fps, although this can be passed in as an option into the Timeline constructor.


###Time Remapping

The Timeline allows you remap it's time similar to how Time Remap works in After Effects via the special property timeRemap. An array of timeRemap keyframe a can be added to the Timeline options via the constructor.

```

		const timeline = new Timeline("park", {

			timeRemap: [

				{

					time: 250,

					value: 500

				},

				{

					time: 500,

					value: 1000

				},

				{

					time: 5000,

					value: 750

				}

			]

		});
```




