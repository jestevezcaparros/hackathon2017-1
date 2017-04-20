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

  const CONTRIB_INSTANCES = [ "mobile-user-00001", "mobile-user-00002" ];

  function createRandomLocationEvent() {
    return {
      "contributor" : CONTRIB_INSTANCES[ getRandomInteger(0, CONTRIB_INSTANCES.length - 1) ],
      "timestamp" : new Date().toISOString(), // TODO generate the right format "2017-04-20T10:52:28.638Z",
      "position" : {
          "latitude" : -4.55763255,
          "longitude" : 36.73469121
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
    return publishEventToStream({
        valoHost: 'localhost',
        valoPort: 8888
      },
      ['demo', 'jotb', streamName],
      event)
  }

  async function eventStep() {

    const locationEvt = createRandomLocationEvent()

    await publishEvent('mob_location', locationEvt)

    if(shallWeSendHappinessEvent()) {

      const happinessEvt = createRandomHappinessEvent(locationEvt)

      await publishEvent('mob_happiness', happinessEvt)

    }

    setTimeout(eventStep, 1000)
  }

  eventStep()

})()
