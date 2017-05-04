"use strict";
/**
 * VOS (Value ObjectS) file
 * Path: valo/src/visualizations_js/src/vo/map_point.js
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 */

 import {
    runSingleQuery
 } from '../../../lib_js/valo_sdk_js';

 import {
   isFunction
 } from 'lodash';

 import {
   HOST,
   TENANT,
   REPLAY,
   REPLAY_INTERVAL
 } from '../settings'

 import Rx from 'rx-lite';

 /**
 * It creates new observable which emits events every REPLAY_INTERVAL milliseconds
 *
 * @param {RxJS.Observable} observable an RxJS observable
 * @return RxJS.Observable
 */
 function replayObservabable(observable){
   const Identity = i => i;
   return observable.zip(
     Rx.Observable.interval(REPLAY_INTERVAL),
     Identity // Identity function
   );
 }

 /**
 * It creates a new Valo session and runs a query in that session
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
 export async function readEvents(query, callback){
   const { observable } = await runSingleQuery(HOST, TENANT, query);
   if(!callback || !isFunction(callback)) return observable;
   const _observable = REPLAY ? replayObservabable(observable) : observable;
   _observable.subscribe(
    payload => payload && callback(null, payload),
    error => callback(error),
    completed => callback(null, null));
 }
