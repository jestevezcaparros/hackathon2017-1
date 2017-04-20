"use strict";
/**
 * Utils module
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

import {
  publishEventToStream
} from '../../../lib_js/valo_sdk_js/index';

import {
  getRandomInteger
} from '../../utils'

(function() {

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
  const STEP_DELAY = 1000

  /**
   * [eventStep description]
   * @method eventStep
   * @return {Promise} [description]
   */
  async function eventStep() {

    // generate random location event
    const locationEvt = createRandomLocationEvent()

    // push it to Valo stream
    await publishEvent(STREAM_NAMES.HAPPINESS, locationEvt)

    // randomly send happiness event
    if(shallWeSendHappinessEvent()) {

      // create random happiness event based on location event (same lat, lang, ts etc)
      const happinessEvt = createRandomHappinessEvent(locationEvt)

      // push it to Valo stream
      await publishEvent(STREAM_NAMES.LOCATION, happinessEvt)

    }

    // repeat any STEP_DELAY seconds
    setTimeout(eventStep, STEP_DELAY)
  }

  function createRandomLocationEvent() {
    return {
      "contributor" : CONTRIB_INSTANCES[ getRandomInteger(0, CONTRIB_INSTANCES.length - 1) ],
      "timestamp" : new Date().toISOString(), // TODO generate the right format "2017-04-20T10:52:28.638Z",
      "position" : {
          "latitude" : -4.55763255, // TODO generate random
          "longitude" : 36.73469121 // TODO generate random
      }
    }
  }

  function createRandomHappinessEvent(locationEvt) {
    return Object.assign({}, locationEvt, { "happiness" : getRandomInteger(-1, 1) })
  }

  function shallWeSendHappinessEvent() {
    return getRandomInteger(0, 100) > 50
  }

  function publishEvent(streamName, event) {
    return publishEventToStream(VALO_DEFAULTS, [TENANT, COLLECTION, streamName], event)
  }

  eventStep()

})()
