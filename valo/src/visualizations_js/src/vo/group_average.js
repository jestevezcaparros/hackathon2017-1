"use strict";
/**
 * VOS (Value ObjectS) file
 * Path: valo/src/visualizations_js/src/vo/group_average.js
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 */

 class GroupAverage {
   constructor(average, group) {
     this.average = average || 0;
     this.group = group || "";
   }
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
