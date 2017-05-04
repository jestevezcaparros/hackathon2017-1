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
  readEvents
} from './common';

import {
  printError
} from '../utils';

import {
 QUERY_MOB_HAPPINESS,
 HISTORICAL_QUERY_MOB_HAPPINESS,
 QUERY_MOB_HAPPINESS_AVG,
 HISTORICAL_QUERY_MOB_HAPPINESS_AVG,
 QUERY_MOB_LOCATION,
 HISTORICAL_QUERY_MOB_LOCATION,
 REPLAY
} from '../settings';

/**
* It runs either HISTORICAL_QUERY_MOB_HAPPINESS
* or QUERY_MOB_HAPPINESS valo query whether replaying or not
*
* @param {Function} callback If provided,
* the observable is not returned. This callback will be called every time a new
* event comes or if an error happends. If no callback is provided, the observable
* is returned instead.
* @return RxJS.Observable?
*/
export async function readHappinesEvents(callback){
  try {
    const query = REPLAY ? HISTORICAL_QUERY_MOB_HAPPINESS : QUERY_MOB_HAPPINESS;
    return readEvents(query, callback);
  } catch (error) {
    printError(error);
    callback(error);
  }
}

/**
* It runs either HISTORICAL_QUERY_MOB_HAPPINESS_AVG or
* QUERY_MOB_HAPPINESS_AVG valo query whether replaying or not
*
* @param {Function} callback If provided,
* the observable is not returned. This callback will be called every time a new
* event comes or if an error happends. If no callback is provided, the observable
* is returned instead.
* @return RxJS.Observable?
*/
export async function readAverageHappinesEvents(callback){
 try {
   const query = REPLAY ? HISTORICAL_QUERY_MOB_HAPPINESS_AVG : QUERY_MOB_HAPPINESS_AVG;
   return readEvents(query, callback);
 } catch (error) {
   printError(error);
   callback(error);
 }
}

/**
* It runs either HISTORICAL_QUERY_MOB_LOCATION or
* QUERY_MOB_LOCATION valo query whether replaying or not
*
* @param {Function} callback If provided,
* the observable is not returned. This callback will be called every time a new
* event comes or if an error happends. If no callback is provided, the observable
* is returned instead.
* @return RxJS.Observable?
*/
export async function readLocationEvents(callback){
 try {
   const query = REPLAY ? HISTORICAL_QUERY_MOB_LOCATION : QUERY_MOB_LOCATION;
   return readEvents(query, callback);
 } catch (error) {
   printError(error);
   callback(error);
 }
}
