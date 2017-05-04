"use strict";
/**
 * VOS (Value ObjectS) file
 * Path: valo/src/visualizations_js/src/vo/map_point.js
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 */

 /**
  * Represents a map point for google maps
  */
 export default class MapPoint {
   constructor(latitude, longitude) {
     this.latitude = latitude;
     this.longitude = longitude;
   }
 }
