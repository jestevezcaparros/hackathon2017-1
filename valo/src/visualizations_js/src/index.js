"use strict";
/**
 * Main module
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author (Each contributor append a line here)
 */


import Map from './map';

import {
  MAP_CONTAINER_CSS_SELECTOR,
  LA_TERMICA_COORDINATES,
  MAP_OPTIONS
} from './settings'

import * as valoDao from './valo/dao'

import {
  createHappinessMapPoint,
  createLocationMapPoint
} from './valo/vos'


async function initMap(){

  try {

    const map = Map(
        document.querySelector(MAP_CONTAINER_CSS_SELECTOR),
        LA_TERMICA_COORDINATES,
        MAP_OPTIONS
    );

    // read events from Valo mob_happiness stream
    valoDao.readMobileHappinesEvents(valoPayload => {

      // convert Valo event to MapPoint, add it to the map
      map.addPoints(createHappinessMapPoint(valoPayload));

    });

    // read events from Valo mob_location stream
    valoDao.readMobileLocationEvents(valoPayload => {

      // convert Valo event to MapPoint, add it to the map
      map.addPoints(createLocationMapPoint(valoPayload));

    });

  } catch (e) {
    console.error(e);
  }

}

(function init(){
  window.initMap = initMap;
})();
