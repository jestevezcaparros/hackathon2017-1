"use strict";
/**
 * Map module
 * @license MIT
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

import {createMap} from '../../utils';
import * as OverlayViewFactory from './factory';

/**
* It sets up a google map v3 instance along two different overlays to
* manage both attenders and iot events over the map.
*
* @param {Object} {domElement: HTMLElement, options: Object}
* The options object is a google v3 api map options
* (https://developers.google.com/maps/documentation/javascript/controls)
* @return Object {attenders, iot}
*/
export default ({domElement, options}) => {
  // Create a google.maps.Map instance
  const map = createMap({domElement, options});
  // Adds the attenders overlay view to the map
  const attenders = OverlayViewFactory.create(
    OverlayViewFactory.ATTENDERS_OVERLAYVIEW, map);
  // Adds the iot overlay view to the map
  const iot = OverlayViewFactory.create(
    OverlayViewFactory.IOT_OVERLAYVIEW, map);
  return {attenders, iot};
}
