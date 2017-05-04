"use strict";
/**
 * Application entry point file
 * Path: valo/src/visualizations_js/src/index.js
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author Danilo Rossi <drossi@itrsgroup.com>
 */

import JotbMap from './components/map/';

import {
  MAP_CONTAINER_CSS_SELECTOR,
  MAP_OPTIONS
} from './settings'

// import DAOs
import * as TweetDAO from './dao/twitter';
import * as MobileDAO from './dao/mobile';
import * as IotDAO from './dao/iot';

// import VOs
import * as AttenderVO from './vo/attender_map_point';
import * as IOTMapPointVO from './vo/iot_map_point';
import * as TweetVO from './vo/tweet';
import * as GroupVO from './vo/group_average';

// import UI Components
import percentBar from './components/percent_bar'
import tweetBox from './components/tweet_box'

import {
  printError,
  printLog
} from './utils';

(function init(){

  try {

    // track the average happiness bar charts
    let averageBars = new Map();

    // reference to the tweet visualization
    let tweetBoxComponent = null;

    // This creates a google Maps Api v3 instance rendering the map
    const map = JotbMap({
      domElement: document.querySelector(MAP_CONTAINER_CSS_SELECTOR),
      options: MAP_OPTIONS
    });

    // utility function
    const getNextBarChartContainer = function() {
      var chartContainer = document.createElement('div');
      chartContainer.classList.add('avg-chart-container');
      document.querySelector('.avg-container').appendChild(chartContainer);
      return chartContainer;
    }

    document.querySelector('#top-menu-about').addEventListener('click', function(event) {
      $('.ui.basic.modal.about').modal('show');
    });

    // read tweets
    TweetDAO.readTweets((err, valoPayload) => {
      console.log('valoPayload', valoPayload)
      // (create twitter box component)
      tweetBoxComponent = tweetBoxComponent || tweetBox(document.querySelector('.tweet-container'));

      // show tweet in the UI
      tweetBoxComponent.show( TweetVO.createTweet(valoPayload) );

    })

    // read average by contributor
    MobileDAO.readAverageHappinesEvents((err, valoPayload) => {

      // create a GroupAverage element
      const groupAverage = GroupVO.createGroupAverage(valoPayload);

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
    });

    // read events from Valo mob_happiness stream
    MobileDAO.readHappinesEvents((error, valoPayload) => {
      // Manage your error
      if(error) return printError(error);

      // convert Valo event to MapPoint, add it to the map
      map.attenders.add(AttenderVO.createHappinessAttenderPoint(valoPayload));
    });

    // read events from Valo mob_location stream
    MobileDAO.readLocationEvents((error, valoPayload) => {

      // Manage your error
      if(error) return printError(error);

      // convert Valo event to MapPoint, add it to the map
      map.attenders.add(AttenderVO.createLocationAttenderPoint(valoPayload));
    });

    // read events from Valo mob_happiness stream
    IotDAO.readTemperatureEvents((error, valoPayload) => {

      // Manage your error
      if(error) return printError(error);
      // convert Valo event to MapPoint, add it to the map
      map.iot.add(IOTMapPointVO.createIOTPoint(valoPayload));
    });

  }
  catch(e){
    printError(e);
  }

})();
