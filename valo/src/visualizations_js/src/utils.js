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

import {
  AUDITORIO_POLYGON,
  POLYGON_ROOM_STYLE,
  MOLLETE_POLYGON,
  PITUFO_POLYGON,
  ENTRANCE_POLYGON,
  POLYGON_BATHROOM_STYLE,
  BATHROOM_POLYGON,
  ITRS_COORDINATES,
  ICON_URL
} from './settings'

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
    const map = new window.google.maps.Map(container, options);

    // CREATE LA TERMICA ROOMS POLYGON
    addPolygon(map, AUDITORIO_POLYGON, POLYGON_ROOM_STYLE);
    addPolygon(map, MOLLETE_POLYGON, POLYGON_ROOM_STYLE);
    addPolygon(map, PITUFO_POLYGON, POLYGON_ROOM_STYLE);
    addPolygon(map, ENTRANCE_POLYGON, POLYGON_ROOM_STYLE);
    addPolygon(map, BATHROOM_POLYGON, POLYGON_BATHROOM_STYLE);

    // Add Icons
    addMarker(map,
        `${ICON_URL}huella3.svg`, {
        latitude: 36.689226,
        longitude: -4.443997
    })

    return map;
}

function addPolygon(map, coords, options = {}) {
    const opt = Object.assign(options, {path: coords});
    const polygon = new google.maps.Polygon(opt);
    polygon.setMap(map);
}

function addMarker(map, icon, position) {

    const LatLng = new google.maps.LatLng(
        position.latitude,
        position.longitude
    );

    const marker = new google.maps.Marker({
        position: LatLng,
        icon: icon,
        map: map
    })
}
