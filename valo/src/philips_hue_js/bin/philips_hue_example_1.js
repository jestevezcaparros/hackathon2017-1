"use strict";
/**
 * Example about how to use Philips Hue with Valo
 * Philips Hue API docs: https://www.developers.meethue.com/
 * With Philips Hue we can visualize Valo queries,
 *   by modulating intensity, hue, saturation of the bulbs. 
 *
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

// HTTP library for communicating with the Philips Hue REST API
import http from 'axios'; // 
// Our Valo mini-sdk for querying a Valo instance 
import {
    runSingleQuery
} from '../../lib_js/valo_sdk_js/index'; 

///////////////////////////////////////////////////////////////////////////////
// DEFINITIONS
///////////////////////////////////////////////////////////////////////////////
// 
// Philips Hue
//
const HUE_HOST = "192.168.1.34";
const HUE_USER = "Odw-QQ0AxXDObwFjoX5KpeocXORnk6jjNieUirFq";
const HUE_URI_PREFIX = `http://${HUE_HOST}`;
const BULB1 = '1';
const BULB2 = '2';
const BULB3 = '3';
//
// VALO
//
const LOCAL_VALO = {valoHost: "localhost", valoPort: 8888};
const TENANT = "demo";
const COLLECTION = "twitter";
const STREAM_NAME = "tweets";

//
// Query 1 extracts field user.followers_count from a tweet
//   This field contains the number of followers of the tweet's author.
//
const QUERY1 = `
from /streams/${TENANT}/${COLLECTION}/${STREAM_NAME}
select tweet.user.followers_count as followers
`;

//
// Query 2 calculates the tweets' creation rate
//   averaged in the last minute and updated each second
//
const QUERY2 = `
from /streams/${TENANT}/${COLLECTION}/${STREAM_NAME}
group by tweet.created_at window of 1 minute every 1 second
select count()/60.0 as tweetsPerSecond
`

//
// Map tweet rate (tweets per second) to a color (hue)
//
const RATE_MAX = 8.0; // Tweets/second
function mapTweetRateToHue(rate) {
    // Linear (inverse) mapping
    // Map blue (hue 46920) to 0 Tweets/second
    // Map red (hue 0) to RATE_MAX Tweets/second (Philips hue command rate limit)     
    // Any rate over RATE_MAX will be displayed as HUE_RED;
    // Negative rates are not expected here!
    const hue =  rate > RATE_MAX ? HUE_RED : (HUE_BLUE - rate * HUE_BLUE/RATE_MAX);
    const truncated = hue|0;
    return truncated;
}

//
// Map followers_count to a color (hue)
//
const FOLLOWERS_MAX = 5000;
function mapFollowersToHue(followers) {
    // Linear mapping
    // Map yellow to 0 followers
    // Map magenta to FOLLOWERS_MAX followers and above
    // Followers expected to be >= 0
    const hue = followers > FOLLOWERS_MAX ?
        HUE_MAGENTA
        :
        (HUE_MAGENTA-HUE_YELLOW)/FOLLOWERS_MAX * followers + HUE_YELLOW;
    ;
    const truncated = hue|0;
    return truncated;
}

///////////////////////////////////////////////////////////////////////////////
// CONSTANTS
///////////////////////////////////////////////////////////////////////////////
//
// Philips Hue
//
const HUE_MIN = 0;
const HUE_MAX = 65280;
const SAT_MIN = 0;
const SAT_MAX = 255;
const BRI_MIN = 0;
const BRI_MAX = 255;

const HUE_RED = 0;
const HUE_YELLOW = 12750;
const HUE_GREEN = 25500;
const HUE_BLUE = 46920;
const HUE_MAGENTA = 56100;

///////////////////////////////////////////////////////////////////////////////
// Main
///////////////////////////////////////////////////////////////////////////////
async function main() {

    try {

        // Build the bulbs's URIs
        const uriBulb1 =  `${HUE_URI_PREFIX}/api/${HUE_USER}/lights/${BULB1}/state`;
        const uriBulb2 =  `${HUE_URI_PREFIX}/api/${HUE_USER}/lights/${BULB2}/state`;
        const uriBulb3 =  `${HUE_URI_PREFIX}/api/${HUE_USER}/lights/${BULB3}/state`;

        // Procedures with bulbs
        async function bulbsOn() {
            // Make sure the bulbs are on and white
            console.log("> Switcing bulbs on ...!");
            await http.put(uriBulb1, {"on" : true, "sat" : SAT_MIN });
            await http.put(uriBulb2, {"on" : true, "sat" : SAT_MIN });
            await http.put(uriBulb3, {"on" : true, "sat" : SAT_MIN });
        }
        async function bulbsAlert() {
            // Check bulbs by sending an alert to each one
            await http.put(uriBulb1, {"alert" : "select" });
            await http.put(uriBulb2, {"alert" : "select" });
            await http.put(uriBulb3, {"alert" : "select" });
        }

        // Reset BULBS upon start
        await bulbsOn();
        await bulbsAlert()

        // Put lights to white when the process is interrupted
        // TODO: this might not work on Windows
        process.on('SIGINT', async () => {
            await bulbsOn();
            await bulbsAlert();
            // Exit!
            process.exit(1);
        });

        // Query VALO - Query 1
        const {
            observable : query1_observable,
            isHistorical : query1_isHistorical,
            outputType : query1_outputType,
        } = await runSingleQuery(LOCAL_VALO, TENANT, QUERY1);

        console.log(`> Query 1 is ${query1_isHistorical?"HISTORICAL":"REAL-TIME"} and ${query1_outputType}`);

        // Query VALO - Query 2
        const {
            observable : query2_observable,
            isHistorical : query2_isHistorical,
            outputType : query2_outputType,
        } = await runSingleQuery(LOCAL_VALO, TENANT, QUERY2);

        console.log(`> Query 2 is ${query2_isHistorical?"HISTORICAL":"REAL-TIME"} and ${query2_outputType}`);


        ///////////////////////////////////////////////////////////////////////
        // Subscribe to querys' observables
        ///////////////////////////////////////////////////////////////////////
        //
        // Query 1 drives bulbs 1 & 2. 
        // Bulb 1 : flash (alert) when receives an event (a processed Tweet)
        // Bulb 2 : Sets its color according to the field "value" 
        //   (value mapped directed to bulb's hue parameter)
        //
        query1_observable.subscribe(
            async evt => {
                try {
                    console.log("QUERY 1 - Valo event: ", JSON.stringify(evt, null, 4));
            
                    const body1 = { "hue" : mapFollowersToHue(evt.followers), "bri" : BRI_MAX, "sat" : SAT_MAX }; 
                    const body2 = {"alert": "select"};
    
                    console.log("> Command to Hue: ", uriBulb1, body1);
                    await http.put(uriBulb1, body1);
                    //console.log("> Command to Hue: ", uriBulb2, body2);
                    await http.put(uriBulb2, body2);
                } catch(e) {
                    console.error("Error in observable 1 subsription", e);
                }
            },
            err => {
                console.error("ERROR in ouput channel's SSE stream (query 1)", err);
            },
            () => {
                console.log("Valo output channel closed");
            }
        );
        //
        // Query 2 drives bulbs 3. 
        //   Field "tweetsPerSecond" contains the rate at which tweets are arriving
        //
        query2_observable.subscribe(
            async evt => {
                try {
                    console.log("QUERY 2 - Valo event: ", JSON.stringify(evt, null, 4));
            
                    const body = { "hue" : mapTweetRateToHue(evt.tweetsPerSecond), "bri" : BRI_MAX, "sat" : SAT_MAX }; 
    
                    console.log("> Command to Hue: ", uriBulb3, body);
                    await http.put(uriBulb3, body);
                } catch(e) {
                    console.error("Error in observable 2 subsription", e);
                }
            },
            err => {
                console.error("ERROR in ouput channel's SSE stream (query 2)", err);
            },
            () => {
                console.log("Valo output channel closed");
            }
        );

    } catch(e) {
        console.error(e);
        console.error("There be errors!");
        throw e;
    }
}

///////////////////////////////////////////////////////////////////////////////
// RUN
///////////////////////////////////////////////////////////////////////////////
main();
