"use strict";
/**
 * Main module
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

import createCanvas from './map';
import {
  runQuery
} from './utils';
import {
  HOST,
  TENANT,
  QUERY,
  QUERY_POSITION,
  LA_TERMICA_COORDINATES,
  MAP_OPTIONS,
  ICON_URL,
  AUDITORIO_POLYGON,
  POLYGON_ROOM_STYLE,
  MOLLETE_POLYGON,
  PITUFO_POLYGON,
  ENTRANCE_POLYGON,
  POLYGON_BATHROOM_STYLE,
  BATHROOM_POLYGON,
  ITRS_COORDINATES
} from './settings'

import {createMap} from './utils';

async function initMap(){

  try {

    const mapContainer = d3.select('body')
        .append('div')
        .attr('class', 'map');

    const map = createMap(
        mapContainer.node(),
        ITRS_COORDINATES,
        MAP_OPTIONS
    );

    const overlay = createCanvas(map);

    // CREATE LA TERMICA ROOMS POLYGON
    addPolygon(map, AUDITORIO_POLYGON, POLYGON_ROOM_STYLE);
    addPolygon(map, MOLLETE_POLYGON, POLYGON_ROOM_STYLE);
    addPolygon(map, PITUFO_POLYGON, POLYGON_ROOM_STYLE);
    addPolygon(map, ENTRANCE_POLYGON, POLYGON_ROOM_STYLE);
    addPolygon(map, BATHROOM_POLYGON, POLYGON_BATHROOM_STYLE);

    // Add Icons
    addMarker(map,
        `${ICON_URL}plano.svg`, {
        latitude: 36.689226,
        longitude: -4.443997
    })


    const statusObservable =  await runQuery(HOST, TENANT, QUERY);
    statusObservable.subscribe(payload => {
      console.log('status', payload);
      if(!payload) return;
      overlay.addPoints({
        latitude: payload.position.latitude,
        longitude: payload.position.longitude,
        icon: `${ICON_URL}${payload.status}.png`
      });
    });

    const positionObservable = await runQuery(HOST, TENANT, QUERY_POSITION);
    positionObservable.subscribe(payload => {
      console.log('position', payload);
      if(!payload) return;
      overlay.addPoints({
        latitude: payload.position.latitude,
        longitude: payload.position.longitude,
        icon:`${ICON_URL}huella3.svg`
      });
    });

  } catch (e) {
    console.error(e);
  }
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




(function init(){
  window.initMap = initMap;
})();
