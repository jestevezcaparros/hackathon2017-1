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

export async function readMobileLocationEvents(){
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
