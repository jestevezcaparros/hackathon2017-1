"use strict";
/**
 * Main module
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

import Map from './map';
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
  ICON_URL
} from './settings'

async function initMap(){

  try {

    const mapContainer = d3.select('body')
        .append('div')
        .attr('class', 'map');

    const map = Map(
        mapContainer.node(),
        LA_TERMICA_COORDINATES,
        MAP_OPTIONS
    );

    const statusObservable =  await runQuery(HOST, TENANT, QUERY);
    statusObservable.subscribe(payload => {
      console.log('status', payload);
      if(!payload) return;
      map.addPoints({
        latitude: payload.position.latitude,
        longitude: payload.position.longitude,
        icon: `${ICON_URL}${payload.status}.png`
      });
    });

    const positionObservable = await runQuery(HOST, TENANT, QUERY_POSITION);
    positionObservable.subscribe(payload => {
      console.log('position', payload);
      if(!payload) return;
      map.addPoints({
        latitude: payload.position.latitude,
        longitude: payload.position.longitude,
        icon:`${ICON_URL}footprints.png`
      });
    });

  } catch (e) {
    console.error(e);
  }
}

(function init(){
  window.initMap = initMap;
})();
