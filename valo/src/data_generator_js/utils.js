"use strict";
/**
 * Utility/helper functions for the javascript Valo data generation app
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

/**
 * [getRandomInteger description]
 * @method getRandomInteger
 * @param  {[type]}         low  [description]
 * @param  {[type]}         high [description]
 * @return {[type]}              [description]
 */
export function getRandomInteger(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}
 
