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

let iconStore = new Map();
let polygonStore = new Array();
let markerStore = new Array();

export function getIcon(src){
  if(iconStore.has(src)) return iconStore.get(src);
  const iconImg = new Image();
  iconImg.src = src;
  iconStore.set(src, iconImg);
  return iconImg;
}

export function printError(...args){
  console.error(...args);
}

export function printLog(...args){
  console.log(...args);
}

function iconSizeFromZoomLevel(zoomLevel){
  switch(zoomLevel){
    case 18: return 8;
    case 19: return 18;
    case 20: return 24;
    default: return 24;
  }
}

export function plotPoint(context, point, projection, zoomLevel=20) {
    context.drawImage(
      getIcon(point.icon),
      projection.fromLatLngToDivPixel(point.geo).x,
      projection.fromLatLngToDivPixel(point.geo).y,
      iconSizeFromZoomLevel(zoomLevel),
      iconSizeFromZoomLevel(zoomLevel));
}


 /**
 *
 * @param {*} google
 * @param {*} container
 * @param {*} coordinates
 */
export function createMap({domElement, options}) {
    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(options.center.bounds.sw.lat, options.center.bounds.sw.lon),
      new window.google.maps.LatLng(options.center.bounds.ne.lat, options.center.bounds.ne.lon));
    options.center = new window.google.maps.LatLng(options.center.lat, options.center.lon);
    const map = new window.google.maps.Map(domElement, options);
    window.google.maps.event.addListener(map, "dragend", () => updateMap(map));
    window.google.maps.event.addListener(map, "zoom_changed", () => updateMap(map));
    window.google.maps.event.addListener(map, "resize", () => updateMap(map));
    window.google.maps.event.addListener(map, "bounds_changed", () => updateMap(map));
    window.google.maps.event.addListener(map, "tilesloaded", () => updateMap(map));
    window.google.maps.event.addListener(map, "projection_changed", () => updateMap(map));
    window.addEventListener('resize', ()=> map.fitBounds(bounds));
    drawRooms(map);
    map.fitBounds(bounds)
    return map;
}

function updateMap(map) {
  const zoom = map.getZoom();
  resetPolygons();
  resetMarkers();
  drawRooms(map);
  if(zoom == 20) {
    drawMarkers(map);
  }
  map.setCenter(map.getCenter());
};

function drawRooms(map){
  // CREATE LA TERMICA ROOMS POLYGON
  addPolygon(map, AUDITORIO_POLYGON, POLYGON_ROOM_STYLE);
  addPolygon(map, MOLLETE_POLYGON, POLYGON_ROOM_STYLE);
  addPolygon(map, PITUFO_POLYGON, POLYGON_ROOM_STYLE);
  addPolygon(map, ENTRANCE_POLYGON, POLYGON_ROOM_STYLE);
  addPolygon(map, BATHROOM_POLYGON, POLYGON_BATHROOM_STYLE);
}

function drawMarkers(map){
  // Add Icons
  addMarker(map,
      `${ICON_URL}campero.svg`, {
      latitude: 36.689040,
      longitude: -4.444238
  });
  addMarker(map,
      `${ICON_URL}pitufo.svg`, {
      latitude: 36.688839,
      longitude: -4.445384
  });
  addMarker(map,
      `${ICON_URL}mollete.svg`, {
      latitude: 36.689175,
      longitude: -4.445105
  });
}

function resetPolygons(){
  polygonStore.forEach(polygon => polygon.setMap(null));
  polygonStore = [];
  return true;
}

function resetMarkers(){
  markerStore.forEach(marker => marker.setMap(null));
  markerStore = [];
  return true;
}

function addPolygon(map, coords, options = {}) {
    const opt = Object.assign(options, {path: coords});
    const polygon = new google.maps.Polygon(opt);
    polygon.setMap(map);
    polygonStore.push(polygon);
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
    });
    markerStore.push(marker);
}
