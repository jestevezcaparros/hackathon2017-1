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
  MAP_OPTIONS,
  ICON_URL
} from './settings'

import * as valoDao from './valo/valo_dao'

import {
  createHappinessMapPoint,
  createLocationMapPoint
} from './valo/valo_vo'

async function initMap(){

  try {

    const map = Map(
        document.querySelector(MAP_CONTAINER_CSS_SELECTOR),
        LA_TERMICA_COORDINATES,
        MAP_OPTIONS
    );

    valoDao.readMobileHappinesEvents(valoPayload => {
      map.addPoints(createHappinessMapPoint(valoPayload));
    });

    valoDao.readMobileLocationEvents(valoPayload => {
      map.addPoints(createLocationMapPoint(valoPayload));
    });

  } catch (e) {
    console.error(e);
  }

}


(function init(){
  window.initMap = initMap;
})();
