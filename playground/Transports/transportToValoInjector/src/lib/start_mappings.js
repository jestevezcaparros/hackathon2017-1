/**
 * Start the configured mappings ( Transport origins <--> Valo streams )
 */
import WrapError from './error';
import {
    createStream
} from './valo';

/**
 * Validate mappings
 *
 * @returns {Boolean}
 * @param {Mappings}
 */
function validateMappings(mappings) {

    const res = mappings.constructor === Array
    // TODO: extend this validation
    return res;
}

/**
 * Start a single mapping
 *
 * @returns null
 * @param {Mapping}
 * @throws {ErrorCreatingStream|}  (Assume a validated mapping)
 */
async function startMapping(mapping) {

    ////////////////////////////////////////////////////////////////////////////
    // Get mapping data
    ////////////////////////////////////////////////////////////////////////////
    const {
        transportClient : {host: transportHost, host: transportPort},
        transportType,
        transportOrigin,

        valoClient : {host: valoHost, port: valoPort},
        valoTenant,
        valoCollection,
        valoStream,
        valoSchema,
        valoRepo
    } = mapping;

    ////////////////////////////////////////////////////////////////////////////
    // Create valo stream if needed
    ////////////////////////////////////////////////////////////////////////////

    try {
        const res = await createStream(
            valoHost, valoPort,
            valoTenant, valoCollection, valoStream, valoSchema
        );
    } catch(e) {
        //console.log(e);
        throw WrapError(new Error(), {
            type: "ErrorCreatingStream",
            cause: e
        });
    }

    //conectTransportToStream();
}


/**
 * Start mappings ( Transport origins <--> Valo streams )
 *
 * @throws {InvalidMappings|}
 * @param {Mappings}
 *
 */
export default async function startMappings(mappings) {

    console.log("> Validating mappings...");
    if ( ! validateMappings(mappings) ) throw WrapError(new Error(), {
        type : "InvalidMappings"
    });
    console.log("> Starting mappings...");
    // Start each single mapping
    return await Promise.all(mappings.map(startMapping));
}
