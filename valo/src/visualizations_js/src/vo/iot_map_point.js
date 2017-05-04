"use strict";
/**
 * VOS (Value ObjectS) file
 * Path: valo/src/visualizations_js/src/vo/iot_point.js
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 */

import MapPoint from './map_point';

/**
 * Represents a iot map point for google maps
 */
class IOTPoint extends MapPoint {
  constructor(latitude, longitude, contributor, temperature) {
    super(latitude, longitude);
    this.contributor = contributor;
    this.temperature = temperature;
  }
}

export function createIOTPoint(valoPayload){
  return new IOTPoint(
    valoPayload.position.latitude,
    valoPayload.position.longitude,
    valoPayload.contributor,
    valoPayload.temperature
  );
}
