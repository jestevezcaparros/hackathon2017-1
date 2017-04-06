import {
    createSession,
    startExecutionContext,
    setQuery,
    startQuery
} from '../lib/valo';
import WrapError from '../lib/error';

import EventSource from 'eventsource';
import rx from 'rx-lite';

console.log(createSession);
console.log("here");

const HOST = "localhost";
const PORT = 8888;
const TENANT = "demo";
const MY_QUERY_ID = "q1";

async function main() {

    try {
        ////////////////////////////////////////////////////////////////////////
        // Create session
        ////////////////////////////////////////////////////////////////////////
        const {session} = await createSession(
            {valoHost: HOST, valoPort: PORT},
            TENANT
        );
        const sessionId = session.replace(/.*\//, "");
        console.log("Session created: ", sessionId);

        ////////////////////////////////////////////////////////////////////////
        // Create/reset execution context
        ////////////////////////////////////////////////////////////////////////
        const executionContextInfo = await startExecutionContext(
            {valoHost: HOST, valoPort: PORT},
            [TENANT, sessionId]
        );
        console.log("Execution CTX info: ", executionContextInfo);
        const executionContextInfo2 = await startExecutionContext(
            {valoHost: HOST, valoPort: PORT},
            [TENANT, sessionId]
        );
        console.log("Execution CTX info 2: ", executionContextInfo2);

        ////////////////////////////////////////////////////////////////////////
        // Set query
        ////////////////////////////////////////////////////////////////////////
        const queryState = await setQuery(
            {valoHost: HOST, valoPort: PORT},
            [TENANT, sessionId],
            {
                "id": MY_QUERY_ID,
                "body": "from /streams/demo/infrastructure/cpu",
                "query_type": "valo-query-lang",
                "variables": [
                ]
            }
        );
        console.log("Query state: ", JSON.stringify(queryState, null, 4));

        ////////////////////////////////////////////////////////////////////////
        // SSE
        ////////////////////////////////////////////////////////////////////////
        let outputFullUri;
        try {
            outputFullUri = queryState[0].query.outputs[0].output;
        } catch(e) {
            const err = WrapError(new Error(), {
                type: "TestingError",
                cause: e,
                msg: "Failed to get output channel full uri"
            })
            throw err;
        }
        console.log(outputFullUri);


        const observable = rx.Observable.create( observer => {

            const sseSource = new EventSource(`http://${outputFullUri}`);

            sseSource.onopen = () => {
                console.log("SSE opened");
            };

            sseSource.onmessage = msg => {
                console.log("SSE MSG: ", msg);
                observer.onNext(msg);
            };

            sseSource.onerror = err => {
                console.error("SSE ERROR: ", err);
                observer.onError(err);
            };

            return function dispose() {
                // Cleanup, if needed. Called when a subscription (observer) is disposed
                console.log('disposed');
            }
        });

        const processedObservable = observable
        .map( evt => JSON.parse(evt.data))
        .filter( evt => evt.type === "increment")
        .map(evt => evt.items)
        //.filter( evt => evt.action === "add")
        ;

        processedObservable.subscribe(
            evt => {
                console.log("Next : ", evt);
            },
            err => {
                console.error("Error", err);
            },
            () => {
                console.log("Completed");
            }
        );



        ////////////////////////////////////////////////////////////////////////
        // Start query
        ////////////////////////////////////////////////////////////////////////
        const queryState2 = await startQuery(
            {valoHost: HOST, valoPort: PORT},
            [TENANT, sessionId, MY_QUERY_ID]
        );
        console.log("Query state: ", JSON.stringify(queryState, null, 4));
    } catch(e) {
        console.error("Session error!");
        console.log(e);
    }

}

main();
