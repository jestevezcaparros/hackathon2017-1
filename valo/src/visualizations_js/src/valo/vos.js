"use strict";
/**
 * VOS (Value ObjectS) file
 * Path: valo/src/visualizations_js/src/valo/vos.js
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
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
    this.icon = `${ICON_URL}${icon}.svg`;
  }
}

class GroupAverage {
  constructor(average, group) {
    this.average = average || 0;
    this.group = group || "";
  }
}

class Tweet {
  constructor(fields) {
    this.followers_count = fields.followers_count;
    this.screen_name = fields.screen_name;
    this.name = fields.name;
    this.profile_image_url_https = fields.profile_image_url_https;
    this.text = fields.text;
    this.created_at = fields.created_at;
    this.location = fields.location;
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
    valoPayload.happiness
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
    valoPayload.typeOfParticipant ?
    `footprints-${valoPayload.typeOfParticipant.toLowerCase()}` :
    `footprints`
  );
}

/**
 * Create a valid MapPoint given an event from Valo mobile location stream
 * @method createLocationMapPoint
 * @param  {Object}                valoPayload   A mob_location Valo stream event
 * @return {MapPoint}                            A valid MapPoint
 */
export function createIOTPoint(valoPayload){
  return valoPayload;
}

/**
 * Create a valid GroupAverage given an event from Valo mobile happiness stream with the proper query
 * @method createGroupAverage
 * @param  {Object}                valoPayload   A mob_happiness Valo stream event, from the proper query
* @return {GroupAverage}                         A valid GroupAverage
 */
export function createGroupAverage(valoPayload){
  return new GroupAverage(
    valoPayload['AverageHappiness'],
    valoPayload['TypeOfParticipant']
  );
}

export function createTweet(valoPayload){
  return new Tweet(valoPayload);
}
