import {
    createSession,
    startExecutionContext,
    setQuery
} from '../lib/valo';

console.log(createSession);
console.log("here");

const HOST = "localhost";
const PORT = 8888;
const TENANT = "demo";

async function main() {

    try {
        ////////////////////////////////////////////////////////////////////////
        // Create session
        ////////////////////////////////////////////////////////////////////////
        const {session} = await createSession(HOST, PORT , TENANT);
        const sessionId = session.replace(/.*\//, "");
        console.log("Session created: ", sessionId);

        ////////////////////////////////////////////////////////////////////////
        // Create/reset execution context
        ////////////////////////////////////////////////////////////////////////
        const executionContextInfo = await startExecutionContext(HOST, PORT, [TENANT, sessionId]);
        console.log("Execution CTX info: ", executionContextInfo);
        const executionContextInfo2 = await startExecutionContext(HOST, PORT, [TENANT, sessionId]);
        console.log("Execution CTX info 2: ", executionContextInfo2);

        ////////////////////////////////////////////////////////////////////////
        // Set query
        ////////////////////////////////////////////////////////////////////////
        const queryState = await setQuery(HOST, PORT, [TENANT, sessionId], {
            "id": "q1",
            "body": "from /streams/demo/infrastructure/cpu",
            "query_type": "valo-query-lang",
            "variables": [
            ]
        });
        console.log("Query state: ", JSON.stringify(queryState, null, 4));
    } catch(e) {
        console.error("Session error!");
        console.log(e);
    }

}

main();
