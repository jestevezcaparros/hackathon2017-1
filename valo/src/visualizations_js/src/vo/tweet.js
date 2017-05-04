"use strict";
/**
 * VOS (Value ObjectS) file
 * Path: valo/src/visualizations_js/src/vo/tweet.js
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 */

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

 export function createTweet(valoPayload){
   return new Tweet(valoPayload);
 }
