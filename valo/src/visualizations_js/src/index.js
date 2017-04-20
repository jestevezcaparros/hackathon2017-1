"use strict";
/**
 * Application entry point file
 * Path: valo/src/visualizations_js/src/index.js
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author Danilo Rossi <drossi@itrsgroup.com>
 */

import Map from './map';

import {
  MAP_CONTAINER_CSS_SELECTOR,
  LA_TERMICA_COORDINATES,
  MAP_OPTIONS
} from './settings'

import {
  readMobileHappinesEvents,
  readMobileLocationEvents
} from './valo/dao'

import {
  createHappinessMapPoint,
  createLocationMapPoint
} from './valo/vos'

import {
  printError,
  printLog
} from './utils';

/**
* This creates a google Maps Api v3 instance rendering the map
* afterwards it starts listening to real time events coming from Valo.
*
* It updates the map with the data retrieved from Valo which includes the
* contributor position (given as pairs of lat and long) along the contributor
* status (either of happy, neutral or sad)
* @return undefined
*/
async function initMap(){

  try {

    // Init and render the map onto the DOM
    const map = Map({
      domElement: document.querySelector(MAP_CONTAINER_CSS_SELECTOR),
      options: MAP_OPTIONS
    });

    // read events from Valo mob_happiness stream
    readMobileHappinesEvents((error, valoPayload) => {
      printLog('happiness', valoPayload);
      // Manage your error
      if(error) return printError(error);
      // convert Valo event to MapPoint, add it to the map
      map.addPoints(createHappinessMapPoint(valoPayload));
    });

    // read events from Valo mob_location stream
    readMobileLocationEvents((error, valoPayload) => {
      printLog('position', valoPayload);
      // Manage your error
      if(error) return printError(error);
      // convert Valo event to MapPoint, add it to the map
      map.addPoints(createLocationMapPoint(valoPayload));
    });

  } catch (error) {
    printError(error);
  }
}

(function init(){
  window.initMap = initMap;
})();
