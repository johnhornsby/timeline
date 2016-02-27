import Timeline from './timeline';


export default class InteractiveTimeline extends Timeline {

	_sequences = [];

	constructor(options) {
		super(options);
	}






	/*________________________________________________________

	PUBLIC CLASS METHODS
	________________________________________________________*/

	increment(timeDelta) { return this._increment(timeDelta); }

	setSequences(sequences) { this._setSequences(sequences); }

	getSequences() { return this._sequences; }





	/*________________________________________________________

	PRIVATE CLASS METHODS
	________________________________________________________*/

	_increment(timeDelta) {
		let outDelta, sequenceOutTime;

		// get current sequence
		const currentSequence = this._getSequenceByTime(this._currentTime);

		this._currentTime += timeDelta;

		// get updated sequence with current time
		let prospectiveSequence = this._getSequenceByTime(this._currentTime);

		// using sequences currently only works travelling forwards
		if (timeDelta > 0) {
			// we only start to think about redirect if last time was within a sequence
			if (currentSequence != null) {
				// check to see we have left the current sequence and that the current sequence has a next location 
				if (currentSequence !== prospectiveSequence && currentSequence.next != null) {
					
					// if there is a prospective then check that its not the next of current
					if (prospectiveSequence != null) {

						if (currentSequence.next !== prospectiveSequence.label) {
							// if duration is set on current the outDelta should be from after the duration
							if (currentSequence.duration) {
								sequenceOutTime = currentSequence.time + currentSequence.duration;
							} else {
								// otherwise no duration set the current sequence extends to the begining of the prospective
								sequenceOutTime = prospectiveSequence.time;
							}
						} else {
							sequenceOutTime = prospectiveSequence.time;
						}
					} else {
						// if prospective is null and current is not, then a duration must be set, so use that

						sequenceOutTime = currentSequence.time + currentSequence.duration;
					}
					// this makes the assumption we have travelled forward and have moved out of the current sequence to the right,
					// if we have move out of the sequence to the left therefore backwards the outDelta is from the end of the 
					// sequence
					outDelta = this._currentTime - sequenceOutTime;
					// adjust time and update current
					prospectiveSequence = this._getSequenceByLabel(currentSequence.next);

					this.currentTime = prospectiveSequence.time + outDelta;
				}
			}
		}

		return this._getState(this._currentTime);
	}


	_setSequences(sequences) {
		// merge sequence
		// validate check for overlaping
		this._sequences = sequences;
	}


	_getSequenceByTime(time) {
		let sequence;

		for (let i = 0; i < this._sequences.length; i++) {
			if (this._sequences[i].time > time) {
				break;
			}
			sequence = this._sequences[i];
		}

		if (sequence) {
			// check if time is beyond last sequence
			if (sequence.duration && time > sequence.time + sequence.duration ) {
				return null;
			}
			// return the current sequence
			return sequence;
		}

		// no relevent sequences
		return null;
	}


	_getSequenceByLabel(label) {
		for (let i = 0; i < this._sequences.length; i++) {
			if (this._sequences[i].label === label) {
				return this._sequences[i];
			}
		}
	}

}             
