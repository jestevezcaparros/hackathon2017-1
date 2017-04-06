/**
 * Start the configured mappings ( Transport origins <--> Valo streams )
 */
import WrapError from './error';
import {
    retryOnConflict,
    createStream,
    setStreamRepository,
    publishEventToStream
} from './valo';
import mqtt from 'mqtt'; // Eventually, add a transport dispacher layer

////////////////////////////////////////////////////////////////////////////////
// DEFINITIONS
//
const TRANSPORT_TIMEOUT =  2000; // Wait for 2 seconds for transport to connect
////////////////////////////////////////////////////////////////////////////////

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
 * @param {Mapping} (Assume a validated mapping, so it won't cause errors)
 * @throws { ErrorCreatingStream |
             ErrorSettingStreamRepository |
             NonSupportedTransportType |
             TransportTimeout
            }
 */
async function startMapping(mapping) {

    ////////////////////////////////////////////////////////////////////////////
    // Get mapping data
    ////////////////////////////////////////////////////////////////////////////
    const {
        transportClient : {host: transportHost, port: transportPort},
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
            {valoHost, valoPort},
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
            {valoHost, valoPort},
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

    ////////////////////////////////////////////////////////////////////////////
    // Connect to transport
    ////////////////////////////////////////////////////////////////////////////
    // TODO: eventually, different transports should be supported
    // TODO: for the moment, assume mqtt
    if (transportType !== 'mqtt') throw WrapError(new Error(), {
        type : "NonSupportedTransportType",
        msg : "Only mqtt transporft supported for now!",
        mapping
    });

    // TODO: here should be some dispatching to transports in the future
    try {
        const uri = `${transportType}://${transportHost}`;
        console.log(`> Connecting to transport: ${uri} ...`);
        const client = mqtt.connect(uri);

        //
        // Wait until connection is up and running!
        //
        await new Promise( (resolve, reject) => {
            // Fails when timeout
            setTimeout(
                () => {
                    reject(WrapError(new Error, {
                        type: "TransportTimeout",
                        timeoutInMillis: TRANSPORT_TIMEOUT
                    }))
                }, TRANSPORT_TIMEOUT
            );
            // Succeeds when connected
            client.on('connect', () => {
                console.log("> Transport connected");
                resolve();
            })
        });

        //
        // Client is ready now to subscribe
        //
        client.subscribe(transportOrigin);
        client.on('message', async (topic, message) => {
            console.log("> Message: ", topic, message.toString());
            //
            // Prepare event
            // If event is a primitive value, wrap it in {value: } !
            //
            const parsedMessage = JSON.parse(message.toString('utf-8'));
            const evt = message.constructor !== Object ?
                { value: parsedMessage, timestamp: new Date() }
                : parsedMessage ;
            // While we do not have proper contributors, let's extend
            //  the event with an "origin" field
            // TODO: this is temporary
            Object.assign(evt, {"origin": transportOrigin});
            console.log(evt);
            //
            // Publish event
            //
            // TODO: how do we DETECT if event is not reaching VALO!!!
            await publishEventToStream(
                valoHost, valoPort,
                [valoTenant, valoCollection, valoStream],
                evt
            );

        });
        client.on('error', (e) => {
            console.log("> Transport Error: ", e);
        });

    } catch (e) {
        throw e;
    }

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
