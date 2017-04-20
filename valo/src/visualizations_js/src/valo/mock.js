"use strict";
/**
 * Mock file
 * Path: valo/src/visualizations_js/src/valo/mock.js
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 */

 import Rx from 'rx-lite';
 import {
   QUERY_MOB_HAPPINESS,
   QUERY_MOB_LOCATION
 } from '../settings';

 /**
 * Gets a random coords into a circle of raidus r
 * taken x0 and y0 as initial point
 * @param {Number} x0 Start latitude
 * @param {Number} y0 Start longitude
 * @param {Number} r Radius
 * @return {Object} A coord containing {latitude, longitude} within the radius given
 */
 function _getRandomCoord(x0, y0, r) {
   const u = Math.random();
   const v = Math.random();
   const radiusInDegrees= r/111300;
   const w = radiusInDegrees * Math.sqrt(u);
   const t = 2 * Math.PI * v;
   const x = w * Math.cos(t);
   const y = w * Math.sin(t);
   const xi = x / Math.cos(y0);
   return {
     latitude: xi+x0,
     longitude: y+y0
   };
  }

  /**
  * Returns a possible value of -1, 0 and 1
  * @return {Number} Either of [-1, 0, 1]
  */
 function _getRandomHapiness() {
   const values = [-1, 0, 1];
   return values[~~(Math.random()*values.length)];
 }

 /**
 * Generates a mock payload for a query
 * @param {Number} lat latitude
 * @param {Number} long longitude
 * @param {Number} radius Radius
 * @param {Boolean} happines if wanna include happiness too
 * @return {Object} The payload generated
 */
 function getPayload(lat, lon, radius, happiness){
   const payload = {
     position: _getRandomCoord(lat, lon, radius)
   };
   if(happiness){
     payload.happiness = _getRandomHapiness()
   }
   return payload;
 }

 /**
 * Generates a mock observable returning payloads (look at getPayload function)
 * @param {Number} Interval Emits every <interval> time
 * @param {Number} lat Start latitude
 * @param {Number} long Start longitude
 * @param {Number} radius Radius
 * @param {Boolean} happines if wanna include happiness too
 * @return {Object} An observable
 */
 function _getMockObservable(interval=50, lat=-100, lon=-100, radius=10, happiness=false){
   return Rx.Observable.create( observer => {
     const emitEvent = () => {
       observer.onNext(getPayload(lat, lon, radius, happiness));
       setTimeout(emitEvent, interval);
     }
     emitEvent();
   });
 }

 /**
 * Generates a mock observable returning payloads (look at getPayload function)
 * depending on the query given as input
 * @param {String} query The query to mock
 * @throws NO_QUERY_ARGUMENT_PROVIDED_ERROR
 * @return {Object} An observable
 */
 export function runSingleQueryMocked(query){
   switch(query){
     case QUERY_MOB_HAPPINESS:
        return {
          observable: _getMockObservable(5000, 36.689053, -4.445253, 30, true)
        };
     case QUERY_MOB_LOCATION:
       return {
         observable: _getMockObservable(1000, 36.689053, -4.445253, 30)
       };
     default:
      throw Error('NO_QUERY_ARGUMENT_PROVIDED_ERROR');
   }
 }
