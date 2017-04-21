"use strict";
/**
 * Utils module
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

import {
   runSingleQuery
} from '../../../lib_js/valo_sdk_js';

import {
  HOST,
  TENANT,
  QUERY_MOB_HAPPINESS,
  QUERY_MOB_LOCATION
} from '../settings'

export async function readMobileHappinesEvents(callback){
 try {
    const { observable } = await runSingleQuery(HOST, TENANT, QUERY_MOB_HAPPINESS);
    observable.subscribe(payload => {
      console.log('status', payload);
      payload && callback(payload);
    });
    // TODO on error?
 } catch (e) {
   console.error(e);
   throw e;
 }
}

export async function readMobileLocationEvents(callback){
 try {
   const { observable } = await runSingleQuery(HOST, TENANT, QUERY_MOB_LOCATION);
   observable.subscribe(payload => {
     console.log('status', payload);
     payload && callback(payload);
   });
   // TODO on error?
 } catch (e) {
   console.error(e);
   throw e;
 }
}








/* TODO mocked up data from Valo
* should be a query like:

  from /streams/demo/jotb/mob_happiness
  select contributor.user.typeOfParticipant as participant, happiness, timestamp
  group by participant
  select avg(happiness), participant

*
*/
export async function readGroupsAvg(callback){

  function getRandomInteger(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low)
  }
  function getRandomHappiness(low, high) {
    return (Math.random() * (high - low) + low).toFixed(4)
  }
  const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4']

   setInterval(() => {
     const payload = {
       "avg": getRandomHappiness(-1, 1),
       "participant": groups[getRandomInteger(0, groups.length - 1)],
     };
     console.log('payload', payload);
     payload && callback(payload);
   }, 1000);

}
