import WrapError from '../../util_js/error';

/*
 *  Builds uri for http rest api
 */
export function buildUri(host, port, ...pathSegments) {
    return `http://${host}:${port}/${pathSegments.join('/')}`
}

/*
 *  Builds and throws error from API status code
 */
export function throwValoApiError(cause, statusToErrorMap) {
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
export function processValoSseObservable(rawObservable) {
    return rawObservable
        .pluck("data")
        .map(JSON.parse)
        .filter(evt => evt.type === "increment")
        .flatMap(evt => evt.items)
        .pluck("data")
        ;
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
