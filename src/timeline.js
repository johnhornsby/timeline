const TIMELINE_DEFAULT_OPTIONS = {
  loop: false
}

export default class Timeline {

  constructor(options) {
    //this._currentTime = 0;
    this._loop = null;
    this._options = null;
    this._duration = null;
    this._tweens = new Map();
    
    this._init(options);
  }
  
 
  addTweenLayer(tweenLayer) { this._addTweenLayer(tweenLayer); }
  
  getState(time) { return this._getState(time); }
  
  get duration() { return this._duration; }
  set duration(duration) {
    this._duration = this._options.duration = duration;
  }
  
  set loop(boolean) {
    this._loop = boolean;
  }
  
  
  _init(options) {
    this._options = Object.assign({}, TIMELINE_DEFAULT_OPTIONS, options);
  }
  
  
  _addTweenLayer(tweenLayer) {
    // here we need to merge tween map with our tweens map
    //iterate over map and clone value
    
    tweenLayer.forEach((propertiesObject, key) => {
      if (this._tweens.has(key) === false) {
        this._tweens.set(key, propertiesObject);
        this._updateDuration(tweenLayer);
      }
    });
  }
  
  
  _updateDuration(tweenLayer) {
    // if duration has been specifically set then don't auto calculate
    if (this._options.duration == null) {
      if (this._duration == null) {
        this._duration = 0;
      }
     
      this._tweens.forEach((propertiesObject, key) => {
        for (var prop in propertiesObject) {
          if ( propertiesObject.hasOwnProperty( prop )) {
            propertiesObject[prop].forEach((keyframe, index) => {
              this._duration = Math.max(this._duration, keyframe.time);
            });
          } 
        }
      });
      
    }
  }
  
  
  _getState(time) {
    const stateMap = new Map();
    if (this._loop) {
      // wrap time
      time = ((time % this._duration) + this._duration) % this._duration;
    }
    // iterate over map properies
    this._tweens.forEach((propertiesObject, key) => {
      // interate over object properties

      const propertiesStateObject = {};
      let keyframes;
      
      for (var prop in propertiesObject) {
        if ( propertiesObject.hasOwnProperty( prop )) {
          keyframes = propertiesObject[prop];
          propertiesStateObject[prop] = this._getTweenValue(keyframes, time);
        } 
      }
      // set tweenObject back into map against key
      stateMap.set(key, propertiesStateObject);
    }); 
    // return map
    return stateMap;
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


                  