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
 *
 * @returns {Object} - Streams's schema
 * @throws {VALO.NoResponseFromValo | VALO.Unauthorized | VALO.Forbidden | VALO.Conflict | VALO.BadGateway }
 */
export async function createStream(valoHost, valoPort, [tenant, collection, name], schema, headers) {

    try {
        const uri = buildUri(valoHost, valoPort, "streams", tenant, collection, name);
        console.log("> Creating stream: ", uri);
        const res = await http.put(uri, {schema}, {headers});
        return res;
    } catch(e) {
        // Check if there is a response
        const response = e.response;
        throwValoApiError(
            {
                401 : "Unauthorized",
                403 : "Forbidden",
                409 : "Conflict",
                502 : "BadGateway"
            },
            response,
            e
        );
    }
}


export function setStreamRepository(valoHost, valoPort, tenant, collection, name, data) {


}

export function publishEventToStream(valoHost, valoPort, tenant, collection, name, event) {


}

/**
 * Retry-on-conflict decorator for API calls
 * Grabs
 */
export function retryOnConflict(f) {
    console.log("> Retry On Conflict");
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
function throwValoApiError(statusToErrorMap, response, cause) {
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
