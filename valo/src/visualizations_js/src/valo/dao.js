"use strict";
/**
 * DAO (Data Access Object) file
 * Path: valo/src/visualizations_js/src/valo/dao.js
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 */
import {
   runSingleQuery
} from '../../../lib_js/valo_sdk_js';

import {
   runSingleQueryMocked
} from './mock';

//@TODO: remove or replace lodash utils (just one utils file)
import {
  printError
} from '../utils';

import {
  isFunction
} from 'lodash';

import {
  HOST,
  TENANT,
  QUERY_MOB_HAPPINESS,
  HISTORICAL_QUERY_MOB_HAPPINESS,
  QUERY_MOB_LOCATION,
  HISTORICAL_QUERY_MOB_LOCATION,
  QUERY_HAPPINESS_AVG,
  HISTORICAL_QUERY_HAPPINESS_AVG,
  QUERY_TWEETS,
  REPLAY,
  DEBUG
} from '../settings'

import Rx from 'rx-lite';

const SHOULD_REPLAY = REPLAY || window.location.search.includes('replay');

function replayObservabable(observable){
  return observable.zip(
    Rx.Observable.interval(500),
    i => i // Identity function
  );
}
/**
* It creates a new Valo session and runs the QUERY_MOB_HAPPINESS query
* Once query is created on Valo it is started and a new SSE connection is opened
* That connection is wrapped around an RxJS observable object so it is just
* needed to subscribe to the observable to process the payloads coming from Valo
*
* @param {Function<ErrorObject, PayloadObject>} callback? If provided,
* the observable is not returned. This callback will be called every time a new
* event comes or if an error happends. If no callback is provided, the observable
* is returned instead.
* @return RxJS.Observable?
*/
export async function readMobileHappinesEvents(callback){
 try {
    let dataBuffer = [];
    const { observable } = await (DEBUG ?
      runSingleQueryMocked(SHOULD_REPLAY ? HISTORICAL_QUERY_MOB_HAPPINESS : QUERY_MOB_HAPPINESS) :
      runSingleQuery(HOST, TENANT, SHOULD_REPLAY ? HISTORICAL_QUERY_MOB_HAPPINESS: QUERY_MOB_HAPPINESS));
    if(!callback || !isFunction(callback)) return observable;
    const _observable = SHOULD_REPLAY ? replayObservabable(observable) : observable;
    _observable.subscribe(
     payload => payload && callback(null, payload),
     error => callback(error),
     completed => callback(null, null));
 } catch (error) {
   printError(error);
   callback(error);
 }
}

/**
* It creates a new Valo session and runs the QUERY_MOB_HAPPINESS query
* Once query is created on Valo it is started and a new SSE connection is opened
* That connection is wrapped around an RxJS observable object so it is just
* needed to subscribe to the observable to process the payloads coming from Valo
*
* @param {Function<ErrorObject, PayloadObject>} callback? If provided,
* the observable is not returned. This callback will be called every time a new
* event comes or if an error happends. If no callback is provided, the observable
* is returned instead.
* @return RxJS.Observable?
*/
export async function readMobileLocationEvents(callback){
  try {
     let dataBuffer = [];
     const { observable } = await (DEBUG ?
       runSingleQueryMocked(SHOULD_REPLAY ? HISTORICAL_QUERY_MOB_LOCATION : QUERY_MOB_LOCATION) :
       runSingleQuery(HOST, TENANT, SHOULD_REPLAY ? HISTORICAL_QUERY_MOB_LOCATION : QUERY_MOB_LOCATION));
    if(!callback || !isFunction(callback)) return observable;
    const _observable = SHOULD_REPLAY ? replayObservabable(observable) : observable;
    _observable.subscribe(
     payload => payload && callback(null, payload),
     error => callback(error),
     completed => callback(null, null));
  } catch (error) {
    printError(error);
    callback(error);
  }
}

/* TODO
*
*
*/
export async function readGroupsAvg(callback){

  try {
     let dataBuffer = [];
     const { observable } = await runSingleQuery(HOST, TENANT, SHOULD_REPLAY ? HISTORICAL_QUERY_HAPPINESS_AVG : QUERY_HAPPINESS_AVG);
     if(!callback || !isFunction(callback)) return observable;
     const _observable = SHOULD_REPLAY ? replayObservabable(observable) : observable;
     _observable.subscribe(
      payload => payload && callback(null, payload),
      error => callback(error),
      completed => callback(null, null)
    );
  } catch (error) {
    printError(error);
    callback(error);
  }

}

/* TODO
*
*
*/
export async function readTweets(callback){

  try {
     let dataBuffer = [];
     const { observable } = await runSingleQuery(HOST, TENANT, QUERY_TWEETS);
     if(!callback || !isFunction(callback)) return observable;
     const _observable = SHOULD_REPLAY ? replayObservabable(observable) : observable;
     _observable.subscribe(
      payload => payload && callback(null, payload),
      error => callback(error),
      completed => callback(null, null)
    );
  } catch (error) {
    printError(error);
    callback(error);
  }

}
