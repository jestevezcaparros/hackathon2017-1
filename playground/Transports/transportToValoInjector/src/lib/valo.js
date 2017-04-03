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
export async function createStream(valoHost, valoPort, tenant, collection, name, schema) {

    try {
        const uri = buildUri(valoHost, valoPort, "streams", tenant, collection, name);
        console.log("> Creating stream: ", uri);
        const res = await http.put(uri, {schema});
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
            msg : response.data
        });
    }
}

/**
 * Retry-on-conflict decorator
 */
function retryOnConflict(f) {

}
