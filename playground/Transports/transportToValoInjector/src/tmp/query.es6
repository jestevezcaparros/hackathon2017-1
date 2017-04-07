import {
    runSingleQuery
} from '../lib/valo';
import WrapError from '../lib/error';

const HOST = "localhost";
const PORT = 8888;
const TENANT = "demo";
const MY_QUERY_ID = "q1";

async function main() {

    try {
        const {
            observable,
            output,
            outputUri,
            schema,
            outputType,
            isHistorical
        } = await runSingleQuery(
            {valoHost: HOST, valoPort: PORT},
            TENANT,
            "from /streams/demo/Twitter/twitfeed0"
            /*
            {
                //"id": MY_QUERY_ID,
                "body": "from /streams/demo/infrastructure/cpu",
                //"query_type": "valo-query-lang",
                //"variables": []
            }
            */
        );

        console.log("Listening to output channel: ", output);
        console.log(`Query is ${isHistorical?"HISTORICAL":"REAL-TIME"} and ${outputType}`);

        observable.subscribe(
            evt => {
                //console.log("Valo event: ", JSON.stringify(evt, null, 4));
            },
            err => {
                console.error("ERROR in ouput channel's SSE stream", err);
            },
            () => {
                console.log("Valo output channel closed");
            }
        );

    } catch(e) {
        console.log("Error: ", e);
    }

}

main();
