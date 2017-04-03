/**
 * Start the configured mappings ( Transport origins <--> Valo streams )
 */
import WrapError from './error';
import {
    retryOnConflict,
    createStream,
    setStreamRepository
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
 * @throws {ErrorCreatingStream|ErrorSettingStreamRepository}  (Assume a validated mapping)
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
        const res = await (retryOnConflict(createStream))(
            valoHost, valoPort,
            [valoTenant, valoCollection, valoStream], {schema: valoSchema}
        );
    } catch(e) {
        //console.log(e);
        if (e.type === "VALO.Conflict") {
            console.log("> Stream already exists. Skipping stream creation... ");
        } else {
            throw WrapError(new Error(), {
                type: "ErrorCreatingStream",
                cause: e
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Persist stream in repository
    ////////////////////////////////////////////////////////////////////////////
    try {
        const res = await (retryOnConflict(setStreamRepository))(
            valoHost, valoPort,
            [valoTenant, valoCollection, valoStream],
            {
                "name" : valoRepo,
                "config" : {
                    "defaultStringAnalyzer" : "StandardAnalyzer"
                }
            }
        );
    } catch(e) {
        //console.log(e);
        if (e.type === "VALO.Conflict") {
            console.log("> Stream already exists. Skipping stream creation... ");
        } else {
            throw WrapError(new Error(), {
                type: "ErrorSettingStreamRepository",
                cause: e
            });
        }
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
