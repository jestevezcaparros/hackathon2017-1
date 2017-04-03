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
        return await http.put(uri, schema, {headers});
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
 *
 * @returns {Object} - Streams's repo config
 * @throws {VALO.NoResponseFromValo | VALO.Unauthorized | VALO.NotFound| VALO.Conflict}
 */
export async function setStreamRepository(valoHost, valoPort, [tenant, collection, name], data, headers) {

    try {
        const uri = buildUri(valoHost, valoPort, "streams", tenant, collection, name, "repository");
        console.log("> Setting repository: ", uri);
        return await http.put(uri, data, {headers});
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

export function publishEventToStream(valoHost, valoPort, tenant, collection, name, event) {


}

/**
 * Retry-on-conflict DECORATOR for API calls
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
