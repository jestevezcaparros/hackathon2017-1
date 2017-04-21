"use strict";
/**
 * Main module
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author (Each contributor append a line here)
 */


import JotbMap from './map';

import {
  MAP_CONTAINER_CSS_SELECTOR,
  LA_TERMICA_COORDINATES,
  MAP_OPTIONS
} from './settings'

import * as valoDao from './valo/dao'

import {
  createHappinessMapPoint,
  createLocationMapPoint,
  createGroupAverage
} from './valo/vos'

import avgBar from './components/avg_bar'


function getNextBarChartContainer() {
  var chartContainer = document.createElement('div');
  chartContainer.classList.add('avg-chart-container');
  document.querySelector('.avg-container').appendChild(chartContainer);
  return chartContainer;
}
async function initMap(){

  let averageBars = new Map();

  try {

    const map = JotbMap(
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

    // read average by contributor
    valoDao.readGroupsAvg(valoPayload => {

      // create a GroupAverage element
      const groupAverage = createGroupAverage(valoPayload);

      // no bar chart for this group, create a new one
      if(!averageBars.has(groupAverage.group)) {

        // create a bar chart
        const chart =
          avgBar(getNextBarChartContainer())
          .init(groupAverage);

        // store it
        averageBars.set(groupAverage.group, chart);

      } else {

        // update existing bar chart for current event participant
        averageBars.get(groupAverage.group).updateAvg(groupAverage.average);
      }
    })

  } catch (e) {
    console.error(e);
  }

}

(function init(){

  // document.querySelector('#top-menu-about').addEventListener('click', function(event) {
  //   $('.ui.basic.modal.about').modal('show');
  // });

  window.initMap = initMap;
})();
