

const TIMELINE_DEFAULT_OPTIONS = {
  loop: false
}

export default class Timeline {

  constructor(options) {
    //this._currentTime = 0;
    this._loop = null;
    this._options = null;
    this._duration = null;
    this._tweens = [];
    
    this._init(options);
  }
  
 
  addTween(tween) { this._addTween(tween); }
  
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
  
  _addTween(tween) {
    if (this._tweens.indexOf(tween) === -1) {
      this._tweens.push(tween);
      this._updateDuration();
    }
  }

  
  
  _updateDuration() {
     this._duration = 0;
      this._tweens.forEach((tween, index) => {
        this._duration = Math.max(this._duration, tween.duration);
      });
  }
  
  
  _getState(time) {
    const stateMap = new Map();
    // if (this._loop) {
    //   // wrap time
    //   time = ((time % this._duration) + this._duration) % this._duration;
    // }
    // // iterate over map properies
    this._tweens.forEach((tween, index) => {
    //   // interate over object properties
      stateMap.set(tween.identifier, tween.getState(time));
    //   const propertiesStateObject = {};
    //   let keyframes;
      
    //   for (var prop in propertiesObject) {
    //     if ( propertiesObject.hasOwnProperty( prop )) {
    //       keyframes = propertiesObject[prop];
    //       propertiesStateObject[prop] = this._getTweenValue(keyframes, time);
    //     } 
    //   }
    //   // set tweenObject back into map against key
    //   stateMap.set(key, propertiesStateObject);
    }); 
    // // return map
    return stateMap;
  }

}


                  