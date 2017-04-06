/**
 * Valo interactions here:
 *   - Create stream
 *   - Set repository
 *   - Publish event to stream
 */
import http from 'axios';
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
    {valoHost, valoPort},
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
    {valoHost, valoPort},
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
    {valoHost, valoPort},
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
    {valoHost, valoPort},
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
