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
   QUERY_MOB_LOCATION,
   HISTORICAL_QUERY_MOB_HAPPINESS,
   HISTORICAL_QUERY_MOB_LOCATION,
   LA_TERMICA_COORDINATES
 } from '../settings';

import {
  getLocationWithinRadius,
  getRandomWalk,
  getInteger
} from '../../../data_generator_js/mobile/src/random_data_generator';

 /**
 * Generates a mock payload for a query
 * @param {Number} lat latitude
 * @param {Number} long longitude
 * @param {Number} radius Radius
 * @param {Boolean} happines if wanna include happiness too
 * @return {Object} The payload generated
 */
 function getPayload(lat, lon, radius, happiness, randomWalk){
   const payload = {
     position: happiness ? getLocationWithinRadius(lat, lon, radius) : randomWalk()
   };
   if(happiness){
     payload.happiness = getInteger(-1, 1);
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
 function _getMockObservable(interval=50, lat=-100, lon=-100, radius=10, happiness=false, options={}){
   //@TODO set in a setting the start coord point
   const randomWalk = getRandomWalk({latitude: LA_TERMICA_COORDINATES.lat, longitude: LA_TERMICA_COORDINATES.lon});
   return Rx.Observable.create( observer => {
     const emitEvent = () => {
       observer.onNext(getPayload(lat, lon, radius, happiness, randomWalk));
       setTimeout(emitEvent, interval);
     }
     if(!options.historical) return emitEvent();
     Array.from({length: 100})
     .forEach(i=>observer.onNext(getPayload(lat, lon, radius, happiness, randomWalk)));
   });
 }

 /**
 * Generates a mock observable returning payloads (look at getPayload function)
 * depending on the query given as input
 * @param {String} query The query to mock
 * @throws NO_QUERY_ARGUMENT_PROVIDED_ERROR
 * @return {Object} An observable
 */
 export function runSingleQueryMocked(query, options){
   switch(query){
     case QUERY_MOB_HAPPINESS:
        return {
          observable: _getMockObservable(
            5000,
            LA_TERMICA_COORDINATES.lat,
            LA_TERMICA_COORDINATES.lon,
            LA_TERMICA_COORDINATES.radius,
            true,
            options)
        };
     case HISTORICAL_QUERY_MOB_HAPPINESS:
        return {
          observable: _getMockObservable(
            5000,
            LA_TERMICA_COORDINATES.lat,
            LA_TERMICA_COORDINATES.lon,
            LA_TERMICA_COORDINATES.radius,
            true,
            {historical: true})
        };
     case QUERY_MOB_LOCATION:
       return {
         observable: _getMockObservable(
           getInteger(800, 1000),
           LA_TERMICA_COORDINATES.lat,
           LA_TERMICA_COORDINATES.lon,
           LA_TERMICA_COORDINATES.radius,
           false,
           options)
       };
     case HISTORICAL_QUERY_MOB_LOCATION:
       return {
         observable: _getMockObservable(
           getInteger(800, 1000),
           LA_TERMICA_COORDINATES.lat,
           LA_TERMICA_COORDINATES.lon,
           LA_TERMICA_COORDINATES.radius,
           false,
           {historical: true})
       };
     default:
      throw Error('NO_QUERY_ARGUMENT_PROVIDED_ERROR');
   }
 }
