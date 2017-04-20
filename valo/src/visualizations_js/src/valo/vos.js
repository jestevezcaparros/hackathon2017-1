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

/**
 * Create a valid MapPoint given an event from Valo mobile happiness stream
 * @method createHappinessMapPoint
 * @param  {Object}                valoPayload   A mob_happiness Valo stream event
 * @return {MapPoint}                            A valid MapPoint
 */
export function createHappinessMapPoint(valoPayload){
  return new MapPoint(
    payload.position.latitude,
    payload.position.longitude,
    `${ICON_URL}${payload.status}.png`
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
    payload.position.latitude,
    payload.position.longitude,
    `${ICON_URL}footprints.png`
  );
}
