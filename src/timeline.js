

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
  
 
  addTween(tween, time) { this._addTween(tween, time); }
  
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
  

  _addTween(tween, time = 0) {
    if (this._tweens.length === 0 || this._tweens.find((tweenObjectData) => tweenObjectData.tween === tween) === false) {
      this._tweens.push({
        tween,
        time
      });
      this._updateDuration();
    }
  }

  
  _updateDuration() {
     this._duration = 0;
      this._tweens.forEach((tweenObjectData, index) => {
        this._duration = Math.max(this._duration, tweenObjectData.time + tweenObjectData.tween.duration);
      });
  }
  
  
  _getState(time) {
    const stateMap = new Map();
    // iterate over map properies
    this._tweens.forEach((tweenObjectData, index) => {
      // interate over object properties
      stateMap.set(tweenObjectData.tween.identifier, tweenObjectData.tween.getState(time - tweenObjectData.time));
    }); 
    // return map
    return stateMap;
  }
}             