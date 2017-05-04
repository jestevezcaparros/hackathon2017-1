"use strict";
/**
* Map Factory module
* @license MIT
* @author Zuri Pabón <zpabon@itrsgroup.com>
* @author (Each contributor append a line here)
*/

import AttendersOverlayView from './attenders/overlay';
import IotOverlayView from './iot/overlay';

// Favor string constants rather nunmeric for debugging purposes
export const ATTENDERS_OVERLAYVIEW = 'ATTENDERS_OVERLAYVIEW';
export const IOT_OVERLAYVIEW = 'IOT_OVERLAYVIEW';

/**
* Wraps the overlay views into a simple factory to enforce
* instances to be created just within the factory
*
* @param {string} type The overlay view type
* (either of ATTENDERS_OVERLAYVIEW or IOT_OVERLAYVIEW)
* @param {Map} map a google.maps.Map instance
* @return {Object} a overlay instance
*/
export function create(type, map) {
  let _instance;
  switch(type){
    case 'ATTENDERS_OVERLAYVIEW':
      _instance = new AttendersOverlayView(map);
      break;
    case 'IOT_OVERLAYVIEW':
      _instance = new IotOverlayView(map);
      break;
    default: throw Error('Overlay View type not implemented')
  }
  return _instance;
}
