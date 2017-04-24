"use strict";
/**
 * Application entry point file
 * Path: valo/src/visualizations_js/src/index.js
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author Danilo Rossi <drossi@itrsgroup.com>
 */

import JotbMap from './map';

import {
  MAP_CONTAINER_CSS_SELECTOR,
  LA_TERMICA_COORDINATES,
  MAP_OPTIONS
} from './settings'

import * as Valo from './valo/dao'

import {
  createHappinessMapPoint,
  createLocationMapPoint,
  createGroupAverage
} from './valo/vos'

import percentBar from './components/percent_bar'

function getNextBarChartContainer() {
  var chartContainer = document.createElement('div');
  chartContainer.classList.add('avg-chart-container');
  document.querySelector('.avg-container').appendChild(chartContainer);
  return chartContainer;
}

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

  let averageBars = new Map();

  try {

    // Init and render the map onto the DOM
    const map = JotbMap({
      domElement: document.querySelector(MAP_CONTAINER_CSS_SELECTOR),
      options: MAP_OPTIONS
    });

    // read events from Valo mob_happiness stream
    Valo.readMobileHappinesEvents((error, valoPayload) => {

      // Manage your error
      if(error) return printError(error);

      // convert Valo event to MapPoint, add it to the map
      map.addPoints(createHappinessMapPoint(valoPayload));
    });

    // read events from Valo mob_location stream
    Valo.readMobileLocationEvents((error, valoPayload) => {

      // Manage your error
      if(error) return printError(error);

      // convert Valo event to MapPoint, add it to the map
      map.addPoints(createLocationMapPoint(valoPayload));
    });

    // read average by contributor
    Valo.readGroupsAvg(valoPayload => {

      // create a GroupAverage element
      const groupAverage = createGroupAverage(valoPayload);

      // no bar chart for this group, create a new one
      if(!averageBars.has(groupAverage.group)) {

        // create a bar chart
        const chart =
          percentBar(getNextBarChartContainer())
          .init(groupAverage, {
            leftIcon: 'red frown icon',
            centerIcon: 'yellow meh icon',
            rightIcon: 'green smile icon'
          });

        // store it
        averageBars.set(groupAverage.group, chart);

      } else {

        // update existing bar chart for current event participant
        averageBars.get(groupAverage.group).updateAvg(groupAverage.average);
      }
    })

  } catch (error) {
    printError(error);
  }
}

(function init(){

  document.querySelector('#top-menu-about').addEventListener('click', function(event) {
    $('.ui.basic.modal.about').modal('show');
  });

  window.initMap = initMap;
})();
