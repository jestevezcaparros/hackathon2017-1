"use strict";
/**
 * VOS (Value ObjectS) file
 * Path: valo/src/visualizations_js/src/vo/iot_point.js
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 */

/**
 * Create a valid MapPoint given an event from Valo mobile location stream
 * @method createLocationMapPoint
 * @param  {Object}                valoPayload   A mob_location Valo stream event
 * @return {MapPoint}                            A valid MapPoint
 */
export function createIOTPoint(valoPayload){
  return valoPayload;
}
