/**
 * Valo interactions here:
 *   - Create stream
 *   - Set repository
 *   - Publish event to stream
 */
import http from 'axios';
import WrapError from './error';

/**
 * Creates stream in Valo - PUT /streams/:tenant/:collection/:name
 * https://valo.io/docs/api_reference/streams_api.html#put-a-stream
 *
 * @async
 * @returns {Object} - Streams's schema
 * @throws {VALO.NoResponseFromValo | VALO.Unauthorized | VALO.Forbidden | VALO.Conflict | VALO.BadGateway }
 */
export async function createStream(valoHost, valoPort, [tenant, collection, name], schema, headers) {

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
export async function setStreamRepository(valoHost, valoPort, [tenant, collection, name], data, headers) {

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
export async function publishEventToStream(valoHost, valoPort, [tenant, collection, name], evt, headers) {

    try {
        const uri = buildUri(valoHost, valoPort, "streams", tenant, collection, name);
        console.log("> Sending event to: ", uri);
        // TODO: what happens if Valo is not reachable!!! Should be an error!
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
                // TODO: this takes for granted that headers param is in position 4
                args[4] = Object.assign({}, args[4], {"Valo-Config-Version" : valoConfigVersion});
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
export async function createSession(valoHost, valoPort, tenant) {

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
export async function startExecutionContext(valoHost, valoPort, [tenant, id], data, headers) {

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
export async function setQuery(valoHost, valoPort, [tenant, id], data, headers) {

    try {
        const uri = buildUri(valoHost, valoPort, "execution", tenant, "sessions", id, "queries");
        console.log("> Sending query: ", uri);
        const {data: body} = await http.put(uri, data, {headers});
        return body;
    } catch(e) {
        throwValoApiError(e, {});
    }
}
