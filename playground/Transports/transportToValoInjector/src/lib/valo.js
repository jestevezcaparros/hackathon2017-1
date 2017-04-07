/**
 * Valo interactions here:
 *   - Create stream
 *   - Set repository
 *   - Publish event to stream
 */
import http from 'axios';
import rx from 'rx-lite';
import EventSource from 'eventsource';
import WrapError from './error';

//
// DEFINITIONS
//
const DEFAULT_HOST = "localhost";
const DEFAULT_PORT = 8888;
const DEFAULT_HEADERS = {"Content-Type" : "application/json"};

/**
 * Creates stream in Valo - PUT /streams/:tenant/:collection/:name
 * https://valo.io/docs/api_reference/streams_api.html#put-a-stream
 *
 * @async
 * @returns {Object} - Streams's schema
 * @throws {VALO.NoResponseFromValo | VALO.Unauthorized | VALO.Forbidden | VALO.Conflict | VALO.BadGateway }
 */
export async function createStream(
    {valoHost = DEFAULT_PORT, valoPort = DEFAULT_PORT},
    [tenant, collection, name],
    schema,
    {headers = DEFAULT_HEADERS} = {}
) {
    try {
        const uri = buildUri(valoHost, valoPort, "streams", tenant, collection, name);
        console.log("> Creating stream: ", uri);
        const {data: body} = await http.put(uri, schema, {headers});
        return body;
    } catch(e) {
        throwValoApiError(e,
            {
                401 : "Unauthorized",
                403 : "Forbidden",
                409 : "Conflict",
                502 : "BadGateway"
            }
        );
    }
}

/**
 * Sets stream's repository in Valo - PUT /streams/:tenant/:collection/:name/repository
 * https://valo.io/docs/api_reference/streams_api.html#put-the-repository-mapping
 *
 * @async
 * @returns {Object} - Streams's repo config
 * @throws {VALO.NoResponseFromValo | VALO.Unauthorized | VALO.NotFound| VALO.Conflict}
 */
export async function setStreamRepository(
    {valoHost = DEFAULT_PORT, valoPort = DEFAULT_PORT},
    [tenant, collection, name],
    data,
    {headers = DEFAULT_HEADERS} = {}
) {
    try {
        const uri = buildUri(valoHost, valoPort, "streams", tenant, collection, name, "repository");
        console.log("> Setting repository: ", uri);
        const {data: body} = await http.put(uri, data, {headers});
        return body;
    } catch(e) {
        throwValoApiError(e,
            {
                401 : "Unauthorized",
                404 : "NotFound",
                409 : "Conflict",
            }
        );
    }
}

/**
 * Sets stream's repository in Valo - PUT /streams/:tenant/:collection/:name/repository
 * https://valo.io/docs/api_reference/streams_api.html#post-data-to-a-stream
 *
 * @async
 * @returns null
 * @throws {VALO.NoResponseFromVal | VALO.NotFound | VALO.InternalServerError}
 */
export async function publishEventToStream(
    {valoHost = DEFAULT_PORT, valoPort = DEFAULT_PORT},
    [tenant, collection, name],
    evt,
    {headers = DEFAULT_HEADERS} = {}
) {

    try {
        const uri = buildUri(valoHost, valoPort, "streams", tenant, collection, name);
        console.log("> Sending event to: ", uri);
        // TODO: what happens if Valo is not reachable!!! There should be an error!
        await http.post(uri, evt, {headers});
    } catch(e) {
        throwValoApiError(e,
            {
                404 : "NotFound",
                500 : "InternalServerError",
            }
        );
    }
}

/**
 * Retry-on-conflict DECORATOR for API calls
 * TODO: only useful for api functions with a body to be sent (3rd param)
 *  as this decorator expects the options in the 4th parameter.
 */
export function retryOnConflict(f) {

    const getValoConfigVersionFromBody = body => {
        const regex = /Valo-Config-Version: *([^ \n\r]*)/g ;
        const resultArray = regex.exec(body);
        if (resultArray.length < 2) {
            return null;
        } else {
            return resultArray[1];
        }
    };

    // Return decorated function
    return async function(...args) {
        try {
            const res1 = await f(...args);
            return res1;
        } catch(e) {
            // Handle VALO.Conflict
            if ( e.type !== "VALO.Conflict") {
                // Transparently bubble up error if other than VALO.Conflict
                throw e;
            } else {
                // Handle 409 by retrying ONCE with correct headers
                const response = e.response;
                const valoConfigVersion = getValoConfigVersionFromBody(response.data);
                // TODO: steps above could fail and throw errors!!
                console.log(`> CONFLICT: found existing version ${valoConfigVersion} . Retrying 1 time ...`);
                // Update headers argument, "Valo-Config-Version" field --- [host, port, path, body, headers]
                // TODO: This takes for granted that headers field is in options param in position 3
                // This obviously does not work for api functions that do not have a body to be sent
                const receivedHeaders = args[3] && args[3].headers  || {};
                args[3] = Object.assign(
                    {},
                    args[3],
                    {
                        headers: Object.assign(
                            {},
                            receivedHeaders,
                            {"Valo-Config-Version" : valoConfigVersion}
                        )
                    }
                );
                const res2 = await f(...args);
                return res2;
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
// AUX
////////////////////////////////////////////////////////////////////////////////
/*
 *  Builds uri for http rest api
 */
function buildUri(host, port, ...pathSegments) {
    return `http://${host}:${port}/${pathSegments.join('/')}`
}

/*
 *  Builds and throws error from API status code
 */
function throwValoApiError(cause, statusToErrorMap) {
    // Check if there is a response
    const response = cause.response;
    if (!response) {
        throw WrapError(new Error(), {
            type: "VALO.NoResponseFromValo",
            cause
        });
    } else {
        const errorType = statusToErrorMap[response.status] || "Unknown";
        throw WrapError(new Error(), {
            type : `VALO.${errorType}`,
            status : response.status,
            cause,
            msg : response.data,
            response
        });
    }
}

/**
 * Process Valo SSE observable (from query output channel)
 *  to extract valo events.
 */
function processValoSseObservable(rawObservable) {
    return rawObservable
        .pluck("data")
        .map(JSON.parse)
        .filter(evt => evt.type === "increment")
        .flatMap(evt => evt.items)
        .pluck("data")
        ;
}

////////////////////////////////////////////////////////////////////////////////
// SESSIONS + QUERIES
////////////////////////////////////////////////////////////////////////////////

/**
 * Create session - POST /execution/:tenant/sessions
 * https://valo.io/docs/api_reference/execution_api.html#create-a-new-session
 *
 * @async
 * @returns {"session": "/execution/demo/sessions/4dc03528-59c8-4cb4-8618-71c26681484e"}
 * @throws {VALO.NoResponseFromValo | VALO.NotFound}
 */
export async function createSession(
    {valoHost = DEFAULT_HOST, valoPort = DEFAULT_PORT},
    tenant
) {
    // Check if 2nd param is delivered as an array with 1 item [tenant] and unwrap it
    tenant = tenant.constructor === Array ? tenant[0] : tenant;
    try {
        const uri = buildUri(valoHost, valoPort, "execution", tenant, "sessions");
        console.log("> Creating session: ", uri);
        const {data: body} = await http.post(uri);
        return body;
    } catch(e) {
        throwValoApiError(e,
            {
                404 : "NotFound"
            }
        );
    }
}

/**
 * Create (or update) execution context - PUT /execution/:tenant/sessions/:id
 * https://valo.io/docs/api_reference/execution_api.html#put-an-execution-environment
 *
 * @async
 * @returns
 * @throws {VALO.NoResponseFromValo}
 */
export async function startExecutionContext(
    {valoHost = DEFAULT_HOST, valoPort = DEFAULT_PORT},
    [tenant, id],
    data,
    {headers = DEFAULT_HEADERS} = {}
) {
    try {
        const uri = buildUri(valoHost, valoPort, "execution", tenant, "sessions", id);
        console.log("> Starting execution context: ", uri);
        const {data: body} = await http.put(uri, data, {headers});
        return body;
    } catch(e) {
        throwValoApiError(e, {});
    }
}

/**
 * Make query - PUT /execution/:tenant/sessions/:id/queries
 * https://valo.io/docs/api_reference/execution_api.html#put-a-query
 *
 * @async
 * @returns
 * @throws {VALO.NoResponseFromValo}
 */
export async function setQuery(
    {valoHost = DEFAULT_HOST, valoPort = DEFAULT_PORT},
    [tenant, id],
    data,
    {headers = DEFAULT_HEADERS} = {}
) {
    try {
        const uri = buildUri(valoHost, valoPort, "execution", tenant, "sessions", id, "queries");
        console.log("> Sending query: ", uri);
        const {data: body} = await http.put(uri, data, {headers});
        return body;
    } catch(e) {
        throwValoApiError(e, {});
    }
}

/**
 * Start query - PUT /execution/:tenant/sessions/:id/queries/:queryId/_start
 * https://valo.io/docs/api_reference/execution_api.html#start-a-query
 *
 * @async
 * @returns
 * @throws {VALO.NoResponseFromValo}
 */
export async function startQuery(
    {valoHost = DEFAULT_HOST, valoPort = DEFAULT_PORT},
    [tenant, sessionId, queryId],
    {headers = DEFAULT_HEADERS} = {}
) {
    try {
        const uri = buildUri(
            valoHost, valoPort,"execution", tenant,
            "sessions", sessionId, "queries", queryId, "_start"
        );
        console.log("> Starting query: ", uri);
        const {data: body} = await http.put(uri, {headers});
        return body;
    } catch(e) {
        throwValoApiError(e, {});
    }
}



////////////////////////////////////////////////////////////////////////////////
// QUERY WRAPPERS - on-top layer
////////////////////////////////////////////////////////////////////////////////
/**
 * Make a query
 * Automatically creates a session, execution context, executes and starts a query
 *  on the main thread. (For a webworker implementation this is not useful).
 *
 * @async
 * @returns {
 *              observable: Rx.Observable,
 *              output: String,
 *              outputUri: String,
 *              schema: {},
 *              outputType: String("BOUNDED"|"UNBOUNDED"),
 *              isHistorical: Boolean
 *          }
 * @throws {CouldNotGetQueryObservable}
 * @param {valoHost:String, valoPort:Integer}
 * @param tenant:String
 * @param query: {
 *                  id: String,
 *                  body: String,
 *                  query_type: String,
 *                  variables: [
 *                      {
 *                          id: String,
 *                          value: String,
 *                          type: String
 *                      }
 *                   ]
 *              }
 */
export async function runSingleQuery(
    {valoHost = DEFAULT_HOST, valoPort = DEFAULT_PORT},
    tenant,
    query
) {
    const DEFAULT_QUERY_ID = "unnamed query";
    const DEFAULT_QUERY_LANG = "valo-query-lang";
    try {
        // Allow query be a plain string or a complete query spec as in
        //  https://valo.io/docs/api_reference/execution_api.html#put-a-query
        const query_ = query.constructor === String ?
            {
                id : DEFAULT_QUERY_ID,
                body : query,
                query_type : DEFAULT_QUERY_LANG,
                variables : []
            }
            :
            query
        ;
        // We allow the query spec to have undefined fields, exept for body
        //  and normalize the identifiers.
        const {
            id: queryId = DEFAULT_QUERY_ID,
            body: queryBody,
            query_type: queryType = DEFAULT_QUERY_LANG,
            variables: queryVariables = []
        } = query_;

        console.log(">>> Running single query:" , JSON.stringify(query_));
        ////////////////////////////////////////////////////////////////////////
        // Create session
        ////////////////////////////////////////////////////////////////////////
        const {session} = await createSession(
            {valoHost, valoPort},
            tenant
        );
        // TODO: write utitily function to convert from sessionUri to sessionId
        const sessionId = session.replace(/.*\//, "");
        console.log("> Session created: ", sessionId);

        ////////////////////////////////////////////////////////////////////////
        // Create/reset execution context
        ////////////////////////////////////////////////////////////////////////
        const executionContextInfo = await startExecutionContext(
            {valoHost, valoPort},
            [tenant, sessionId]
        );

        ////////////////////////////////////////////////////////////////////////
        // Set query
        ////////////////////////////////////////////////////////////////////////
        const queryState1 = await setQuery(
            {valoHost, valoPort},
            [tenant, sessionId],
            {
                id: queryId,
                body: queryBody,
                query_type: queryType,
                variables: queryVariables
            }
        );
        console.log("> Query state: ", JSON.stringify(queryState1, null, 4));

        ////////////////////////////////////////////////////////////////////////
        // Get SSE output channel info
        ////////////////////////////////////////////////////////////////////////
        let output,
            outputUri,
            schema,
            outputType,
            isHistorical
        ;
        try {
            output = queryState1[0].query.outputs[0].output;
            if (!output) throw WrapError(new Error(), {
                msg: "Emtpy output field"
            });
            outputUri = queryState1[0].query.outputs[0].outputUri;
            if (!outputUri) throw WrapError(new Error(), {
                msg: "Emtpy outputUri field"
            });
            schema = queryState1[0].query.outputs[0].schema;
            if (!schema) throw WrapError(new Error(), {
                msg: "Emtpy schema field"
            });
            outputType = queryState1[0].query.outputs[0].outputType;
            if (!outputType) throw WrapError(new Error(), {
                msg: "Emtpy outputType field"
            });
            isHistorical = queryState1[0].query.outputs[0].isHistorical;
            if (isHistorical !== false &&
                 isHistorical !== true) throw WrapError(new Error(), {
                msg: "Wrong isHistorical field"
            });
        } catch(e) {
            const err = WrapError(new Error(), {
                type: "OutputChannelError",
                cause: e,
                msg: "Failed to get output channel info"
            })
            throw err;
        }
        console.log("> Output channel: ", output);

        ////////////////////////////////////////////////////////////////////////
        // Create observable
        ////////////////////////////////////////////////////////////////////////
        const rawObservable = rx.Observable.create( observer => {

            const sseSource = new EventSource(`http://${output}`);

            sseSource.onopen = () => {
                console.log("> SSE opened");
            };

            sseSource.onmessage = msg => {
                observer.onNext(msg);
            };

            sseSource.onerror = err => {
                console.error("> SSE ERROR: ", err);
                observer.onError(err);
            };

            return function dispose() {
                // Cleanup, if needed. Called when a subscription (observer) is disposed
                console.log('disposed');
            }
        });

        const processedObservable = processValoSseObservable(rawObservable);

        ////////////////////////////////////////////////////////////////////////
        // Start query
        ////////////////////////////////////////////////////////////////////////
        const queryState2 = await startQuery(
            {valoHost, valoPort},
            [tenant, sessionId, queryId]
        );
        console.log("> Query state: ", JSON.stringify(queryState2, null, 4));

        ////////////////////////////////////////////////////////////////////////
        // Return the observable and all the associated query info
        ////////////////////////////////////////////////////////////////////////
        return {
            observable: processedObservable,
            output,
            outputUri,
            schema,
            outputType,
            isHistorical
        };

    } catch(e) {
        throw WrapError(new Error(), {
            type: "CouldNotGetQueryObservable",
            cause: e
        })
    }
}
