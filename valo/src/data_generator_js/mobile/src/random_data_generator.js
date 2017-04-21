"use strict";
/**
 * Data generator file
 * Path: valo/src/data_generator/mobile/src/random_data_generator.js
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 */

 /**
 * Gets a random coords into a circle of raidus r
 * taken x0 and y0 as initial point
 * @param {Number} x0 Start latitude
 * @param {Number} y0 Start longitude
 * @param {Number} r Radius
 * @return {Object} A coord containing {latitude, longitude} within the radius given
 */
 export function getLocationWithinRadius(x0, y0, r) {
   const u = Math.random();
   const v = Math.random();
   const radiusInDegrees= r/111300;
   const w = radiusInDegrees * Math.sqrt(u);
   const t = 2 * Math.PI * v;
   const x = w * Math.cos(t);
   const y = w * Math.sin(t);
   const xi = x / Math.cos((y0)* Math.PI / 180);
   return Object.freeze({latitude: xi+x0, longitude: y+y0});
  }

 /**
 * Gets a random coords into a circle of raidus r
 * taken x0 and y0 as initial point
 * @param {Number} x0 Start latitude
 * @param {Number} y0 Start longitude
 * @param {Number} r Radius
 * @return {Object} A coord containing {latitude, longitude} within the radius given
 */
 export function getRandomWalk(startPoint) {

   const randomDir = () => ['u', 'd', 'l', 'r'][getInteger(0,3)];
   const increment = 30 * .000001;
   const latestPoint = startPoint;
   latestPoint.direction = randomDir();
   latestPoint.steps = getInteger(4, 10);
   return function(){

     switch(latestPoint.direction){

       case 'u':
        if(latestPoint.latitude <= 36.68993099999992){
         latestPoint.latitude += increment;
        }
        else {
         latestPoint.direction = 'd';
         latestPoint.latitude -= increment;
        }
        break;

       case 'd':
        if(latestPoint.latitude >= 36.6883310000001){
          latestPoint.latitude -= increment;
        }
        else{
          latestPoint.direction = 'u';
          latestPoint.latitude += increment;
        }
        break;

       case 'l':
        if(latestPoint.longitude >= -4.4457909999999945){
          latestPoint.longitude -= increment;
        }
        else {
          latestPoint.direction = 'r';
          latestPoint.longitude += increment;
        }
        break;

       case 'r':
        if(latestPoint.longitude <= -4.443831000000019){
          latestPoint.longitude += increment;
        }
        else{
          latestPoint.direction = 'l';
          latestPoint.longitude -= increment;
        }
        break;
     }
     latestPoint.steps--;
     if(latestPoint.steps<=0){
       latestPoint.direction = randomDir();
       latestPoint.steps = getInteger(4, 10);
     }
     return latestPoint;
   }
  }

 /**
  * Returns a possible integer value in the range [from, to]
  * @method getInteger
  * @param  {Number} from
  * @param  {Number} to
  * @return {Number}
  */
 export function getInteger(from, to) {
   return Math.floor(Math.random() * (to - from + 1) + from);
 }
