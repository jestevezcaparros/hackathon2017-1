"use strict";
/**
 * Utils module
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

// icons base folder
import {
  ICON_URL
} from '../settings'

/**
 * Represents a map point for google maps
 */
class MapPoint {
  constructor(latitude, longitude, icon) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.icon = icon;
  }
}

class GroupAverage {
  constructor(average, group) {
    this.scale = d3.scaleLinear().domain([-1,1]).range([0,100]);
    this.average = this.scale(average || -1);
    this.group = group;
  }
}

/**
 * Create a valid MapPoint given an event from Valo mobile happiness stream
 * @method createHappinessMapPoint
 * @param  {Object}                valoPayload   A mob_happiness Valo stream event
 * @return {MapPoint}                            A valid MapPoint
 */
export function createHappinessMapPoint(valoPayload){
  return new MapPoint(
    valoPayload.position.latitude,
    valoPayload.position.longitude,
    `${ICON_URL}${valoPayload.status}.png`
  );
}

/**
 * Create a valid MapPoint given an event from Valo mobile location stream
 * @method createLocationMapPoint
 * @param  {Object}                valoPayload   A mob_location Valo stream event
 * @return {MapPoint}                            A valid MapPoint
 */
export function createLocationMapPoint(valoPayload){
  return new MapPoint(
    valoPayload.position.latitude,
    valoPayload.position.longitude,
    `${ICON_URL}footprints.png`
  );
}

export function createGroupAverage(valoPayload){
  return new GroupAverage(
    valoPayload.avg,
    valoPayload.participant
  );
}
