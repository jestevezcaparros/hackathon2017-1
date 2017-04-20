"use strict";
/**
 * Utils module
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

import {
    runSingleQuery
} from '../../lib_js/valo_sdk_js';

const iconStore = new Map();

export function getIcon(src){
  if(iconStore.has(src)) return iconStore.get(src);
  const iconImg = new Image();
  iconImg.src = src;
  iconStore.set(src, iconImg);
  return iconImg;
}

export function plotPoint(context, point, projection) {
    context.drawImage(
      getIcon(point.icon),
      projection.fromLatLngToContainerPixel(point.geo).x,
      projection.fromLatLngToContainerPixel(point.geo).y,
      point.iconSize || 32,
      point.iconSize || 32);
}


 /**
 *
 * @param {*} google
 * @param {*} container
 * @param {*} coordinates
 */
export function createMap(container, coordinates, options) {
    options.center = new window.google.maps.LatLng(coordinates.lat, coordinates.lon);
    return new window.google.maps.Map(container, options);
}
