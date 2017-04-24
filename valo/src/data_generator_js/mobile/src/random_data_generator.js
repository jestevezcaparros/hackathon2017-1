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
 * Gets a random walk from an initial point
 *
 * @param {Number} startPoint The point to start off
 * @return {Object} A coord containing {latitude, longitude} within the radius given
 */
 export function getRandomWalk(startPoint) {

   // Bound coords
   const TOP_BOUND = 36.68993099999992;
   const BOTTOM_BOUND = 36.6883310000001;
   const LEFT_BOUND = -4.4457909999999945;
   const RIGHT_BOUND = -4.443831000000019;
   // Possible directions (up, down, left, right)
   const randomDir = () => ['u', 'd', 'l', 'r'][getInteger(0,3)];
   // Simulates the speed
   const increment = 30 * .000001;

   // Track latest coord point to update position according it
   const latestPoint = startPoint;
   latestPoint.direction = randomDir();
   latestPoint.steps = getInteger(4, 10);

   return function(){

     switch(latestPoint.direction){
       // going up
       case 'u':
        if(latestPoint.latitude <= TOP_BOUND){
         latestPoint.latitude += increment;
        }
        else {
         latestPoint.direction = 'd';
         latestPoint.latitude -= increment;
        }
        break;
       // going down
       case 'd':
        if(latestPoint.latitude >= BOTTOM_BOUND){
          latestPoint.latitude -= increment;
        }
        else{
          latestPoint.direction = 'u';
          latestPoint.latitude += increment;
        }
        break;
       // going left
       case 'l':
        if(latestPoint.longitude >= LEFT_BOUND){
          latestPoint.longitude -= increment;
        }
        else {
          latestPoint.direction = 'r';
          latestPoint.longitude += increment;
        }
        break;
       // going right
       case 'r':
        if(latestPoint.longitude <= RIGHT_BOUND){
          latestPoint.longitude += increment;
        }
        else{
          latestPoint.direction = 'l';
          latestPoint.longitude -= increment;
        }
        break;
        default:
          throw new Error('NO_DIRECTION_PROVIDED');
     }
     latestPoint.steps--;
     if(latestPoint.steps<=0){
       // Pick a new direction
       latestPoint.direction = randomDir();
       // How many steps shall user take before changing direction
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
