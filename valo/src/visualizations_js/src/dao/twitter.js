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
  QUERY_TWEETS,
  HISTORICAL_QUERY_TWEETS,
  REPLAY
 } from '../settings';

 /**
 * It runs either HISTORICAL_QUERY_TWEETS or
 * QUERY_TWEETS valo query whether replaying or not
 *
 * @param {Function} callback If provided,
 * the observable is not returned. This callback will be called every time a new
 * event comes or if an error happends. If no callback is provided, the observable
 * is returned instead.
 * @return RxJS.Observable?
 */
 export async function readTweets(callback){
   try {
     const query = REPLAY ? HISTORICAL_QUERY_TWEETS : QUERY_TWEETS;
     return readEvents(query, callback);
   } catch (error) {
     printError(error);
     callback(error);
   }
 }
