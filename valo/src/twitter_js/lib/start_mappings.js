"use strict";
/**
 * Start the configured mappings ( Twitter stream <--> Valo streams )
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor appends a line here)
 */
import WrapError from '../../lib_js/util_js/error';
import {
    retryOnConflict,
    createStream,
    setStreamRepository,
    publishEventToStream
} from '../../lib_js/valo_sdk_js';
import {
    datetimeStringToJSON
} from '../../lib_js/util_js/datetime';
import twitter from './twitter';

////////////////////////////////////////////////////////////////////////////////
// DEFINITIONS
//
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
             NonSupportedDestinationType 
            }
 */
async function startMapping(mapping) {

    ////////////////////////////////////////////////////////////////////////////
    // Get mapping data
    ////////////////////////////////////////////////////////////////////////////
    const {
        twitterClientConfig : {
            consumer_key,
            consumer_secret,
            access_token_key,
            access_token_secret
        },
        twitterTrack,
        destinationType,

        valoClient : {host: valoHost, port: valoPort},
        valoTenant,
        valoCollection,
        valoStream,
        valoSchema,
        valoRepo,
        valoContributorId
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
    // Connect to Twitter
    ////////////////////////////////////////////////////////////////////////////
    // TODO: eventually, different destinations should be supported
    // TODO: for the moment, assume valo
    if (destinationType !== 'valo') throw WrapError(new Error(), {
        type : "NonSupportedDestinationType",
        msg : "Only 'valo' destination supported for now!",
        mapping
    });

    // TODO: here should be some dispatching to transports in the future

    // 
    // Get tweets stream
    //
    let twitterClient;
    try {
        //
        // Get Twitter client 
        //
        twitterClient = twitter.getClient({
            consumer_key,
            consumer_secret,
            access_token_key,
            access_token_secret
        });
    
        //
        // Subscribe to Twitter Streaming API - Returned as RX observable
        // 
        const observable = twitter.getStreamingStatusesFilter(
            twitterClient,
            {track: twitterTrack}
        ); 
        observable.subscribe(
            async evt => {
                try {
                    // Show something in console
                    console.log(`\nA TWEET from @${evt.user.screen_name} :\n ${evt.text}`);
                    //
                    // Update (mutate) created_at fields in tweet
                    //
                    if (evt.created_at) 
                        evt.created_at = datetimeStringToJSON(evt.created_at);
                    if (evt.user && evt.user.created_at)
                        evt.user.created_at = datetimeStringToJSON(evt.user.created_at);
                    //
                    // Process and relay tweet to destination
                    //
                    const processedEvent = {
                        contributor: valoContributorId,
                        tweet: evt
                    };

                    await publishEventToStream(
                        {valoHost, valoPort},
                        [valoTenant, valoCollection, valoStream],
                        processedEvent
                    );       
                } catch(e) {
                    console.error("> ERROR processing Tweet", e);
                }
            },
            err => {
                console.error(">>>> Twitter Streaming Error", err);
            },
            () => {
                console.log(">>>> Twitter Stream Closed");
            } 
        );

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
