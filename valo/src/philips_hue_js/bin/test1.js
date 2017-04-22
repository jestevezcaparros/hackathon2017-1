
import http from 'axios';

import {
    runSingleQuery
} from '../../lib_js/valo_sdk_js/index'; 

//
// DEFINITIONS
//
const HUE_HOST = "192.168.1.35";
const HUE_USER = "Odw-QQ0AxXDObwFjoX5KpeocXORnk6jjNieUirFq";
const HUE_URI_PREFIX = `http://${HUE_HOST}`;
const BULB1 = '1';
const BULB2 = '2';
const BULB3 = '3';

const LOCAL_VALO = {valoHost: "localhost", valoPort: 8888};
const TENANT = "demo";
const COLLECTION = "Twitter";
const STREAM_NAME = "twitfeed0";
let QUERY;
QUERY = `
from /streams/${TENANT}/${COLLECTION}/${STREAM_NAME}
--where user.followers_count > 500
select user.followers_count as value
`;


async function main() {

    try {

        // Switch on the light first
        const uri1 =  `${HUE_URI_PREFIX}/api/${HUE_USER}/lights/${BULB1}/state`;
        const uri2 =  `${HUE_URI_PREFIX}/api/${HUE_USER}/lights/${BULB2}/state`;
        const response1 = await http.put(uri1, {"on" : true });
        const response2 = await http.put(uri2, {"on" : true, "sat" : 0 });

        const {
            observable,
            isHistorical,
            outputType,
            schema
        } = await runSingleQuery(
            LOCAL_VALO,
            TENANT,
            QUERY
        );

        console.log(`Query is ${isHistorical?"HISTORICAL":"REAL-TIME"} and ${outputType}`);

        observable.subscribe(
            async evt => {
                console.log("Valo event: ", JSON.stringify(evt, null, 4));
        
                const body1 = {
                    //"alert" : "select",
                    "hue" : evt.value,
                    "bri" : 240,
                    "sat" : 240 
                }; 
                const body2 = {"alert": "select"};

                console.log("> Command to Hue: ", uri1, body1);
                console.log("> Command to Hue: ", uri2, body2);
                await http.put(uri1, body1);
                await http.put(uri2, body2);
            },
            err => {
                console.error("ERROR in ouput channel's SSE stream", err);
            },
            () => {
                console.log("Valo output channel closed");
            }
        );

    } catch(e) {
        console.error(e);
        console.error("There be errors!");
    }
}

async function main2() {
    
    const uri =  `${HUE_URI_PREFIX}/api/${HUE_USER}/lights/${BULB3}/state`;
    console.log(uri);
    await http.put(
        uri,
        {
            "hue" : 46920,
            "bri" : 100,
            "sat" : 240
        }                 
    );
    console.log("ready");

}

main();
