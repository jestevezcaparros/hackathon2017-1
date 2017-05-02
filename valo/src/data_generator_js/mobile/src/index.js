"use strict";
/**
 * Utils module
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

import {
  publishEventToStream
} from '../../../lib_js/valo_sdk_js/index';

import {
  getLocationWithinRadius,
  getRandomWalk,
  getInteger
} from './random_data_generator';

import {
  LA_TERMICA_COORDINATES
} from '../../../visualizations_js/src/settings';

const CONTRIB_INSTANCES = [ "mobile-user-00001", "mobile-user-00002" ]
const STREAM_NAMES = Object.freeze({
  LOCATION: 'mob_location',
  HAPPINESS: 'mob_happiness'
})
const VALO_DEFAULTS = {
  valoHost: 'localhost',
  valoPort: 8888
}
const TENANT = 'demo'
const COLLECTION = 'jotb'
const STEP_DELAY = 1000;
const SIMULATE_PEOPLE_COUNT = 5;

(function() {

  let peopleRandomWalkData = initPeopleWalk(SIMULATE_PEOPLE_COUNT);

  /**
   * [eventStep description]
   * @method eventStep
   * @return {Promise} [description]
   */
  async function eventStep() {

    // generate random location event
    for(let randomWalk of peopleRandomWalkData){
      const locationEvt = createRandomLocationEvent(randomWalk())
      // push it to Valo stream
      await publishEvent(STREAM_NAMES.LOCATION, locationEvt)

      // randomly send happiness event
      if(shallWeSendHappinessEvent()) {
        // create random happiness event based on location event (same lat, lang, ts etc)
        const happinessEvt = createRandomHappinessEvent(locationEvt)
        // push it to Valo stream
        await publishEvent(STREAM_NAMES.HAPPINESS, happinessEvt)
      }
    }

    // repeat any STEP_DELAY seconds
    setTimeout(eventStep, STEP_DELAY)
  }

  function createRandomLocationEvent(position) {
    return {
      "contributor" : CONTRIB_INSTANCES[ getInteger(0, CONTRIB_INSTANCES.length - 1) ],
      "timestamp" : new Date().toISOString(), // TODO generate the right format "2017-04-20T10:52:28.638Z",
      "position" : position
    }
  }

  function createRandomHappinessEvent(locationEvt) {
    return Object.assign({}, locationEvt, { "happiness" : getInteger(-1, 1) })
  }

  function shallWeSendHappinessEvent() {
    return getInteger(0, 100) > 90
  }

  function publishEvent(streamName, event) {
    return publishEventToStream(VALO_DEFAULTS, [TENANT, COLLECTION, streamName], event)
  }

  function initPeopleWalk(peopleCount){
    // Start coords for random walk algo
    return Array
      .from({length: peopleCount})
      .map(i =>
        getRandomWalk({
          latitude:LA_TERMICA_COORDINATES.lat,
          longitude: LA_TERMICA_COORDINATES.lon
        })
      );
  }

  eventStep();

})()
