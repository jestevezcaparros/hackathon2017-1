"use strict";
/**
 * VOS (Value ObjectS) file
 * Path: valo/src/visualizations_js/src/vo/map_point.js
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 */

import MapPoint from './map_point';

 // icons base folder
 import {
   ICON_URL
 } from '../settings'

 /**
  * Represents an attender point for google maps
  */
 class AttenderPoint extends MapPoint {
   constructor(latitude, longitude, icon) {
     super(latitude, longitude);
     this.icon = `${ICON_URL}${icon}.svg`;
   }
 }

 /**
  * Create a valid AttenderPoint given an event from Valo mobile location stream
  * @method createLocationAttenderPoint
  * @param  {Object}                valoPayload   A mob_location Valo stream event
  * @return {AttenderPoint}                            A valid AttenderPoint
  */
 export function createLocationAttenderPoint(valoPayload){
   return new AttenderPoint(
     valoPayload.position.latitude,
     valoPayload.position.longitude,
     valoPayload.typeOfParticipant ?
     `footprints-${valoPayload.typeOfParticipant.toLowerCase()}` :
     `footprints`
   );
 }

 /**
  * Create a valid MapPoint given an event from Valo mobile happiness stream
  * @method createHappinessMapPoint
  * @param  {Object}                valoPayload   A mob_happiness Valo stream event
  * @return {AttenderPoint}                            A valid AttenderPoint
  */
 export function createHappinessAttenderPoint(valoPayload){
   return new AttenderPoint(
     valoPayload.position.latitude,
     valoPayload.position.longitude,
     valoPayload.happiness
   );
 }
