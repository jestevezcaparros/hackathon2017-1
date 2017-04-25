"use strict";
/**
 * Examples about how Valo query (execution) API is used
 * https://valo.io/docs/api_reference/execution_api.html
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor append a line here)
 */
import {
    runSingleQuery
} from '../index';

//
// DEFINITIONS
//
const LOCAL_VALO = {valoHost: "localhost", valoPort: 8888};
const TENANT = "demo";
const COLLECTION = "iot_board";
const STREAM_NAME = "temperature";
const QUERY = `
from /streams/demo/iot_board/temperature
group by contributor, timestamp window of 1 minute every 1 second
select contributor, timestamp, avg(temperature) as Temperature,
last(position.latitude) as lat, last(position.longitude) as long
`

//
// Run a single query, Async/Await style
//
async function main() {

    try {
        const response = await runSingleQuery(
            LOCAL_VALO,
            TENANT,
            QUERY
        );

        const observable = response.observable;
        const schema = response.schema;
        
        console.log(JSON.stringify(schema, null, 4));

        observable.subscribe(
            event => {
                console.log(JSON.stringify(event, null, 4));
                // HERE we write the main event processing code,
                //  including the call to a visualization draw()
                //  method.
            },
            error => {
                console.error("ERROR: ", error);
            },
            () => {
                console.log("Observable closed.");
            }
        );
        return response;
    } catch(e) {
        console.error(">>> runQuery_A ", e);
        throw e;
    }
}

///////////////////////////////////////////////////////////////////////////////
// Main
///////////////////////////////////////////////////////////////////////////////
main();
