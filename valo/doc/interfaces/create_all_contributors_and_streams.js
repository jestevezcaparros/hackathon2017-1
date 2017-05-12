/**
 * Hackathon @ J On The Beach 2017
 * Creation of tenant, contributors, and streams used in the hackathon
 *
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor append a line here)
 */
import {
    createContributorType,
    registerContributorInstance,
    createStream,   
    setStreamRepository,
    retryOnConflict 
} from '../../src/lib_js/valo_sdk_js/index';

////////////////////////////////////////////////////////////////////////////////
// Definitions
////////////////////////////////////////////////////////////////////////////////
const VALO = {
    valoHost: "localhost",
    valoPort: 8888
};
const TENANT = "demo";

// Contributor types
const CONTRIBUTOR_TYPES = [
    "iot_board",
    "mobile_user",
    "realsense",
    "twitter_app" 
];
// Contributors instances. Each row has [contributorType, instanceName, fileName]
const CONTRIBUTOR_INSTANCES = [
    ["iot_board", "surfboard205", "instance_iot_surfboard205.json"], 
    ["iot_board", "board-00001", "instance_iot_board_01.json"], 
    ["iot_board", "board-00002", "instance_iot_board_02.json"], 
    ["mobile_user", "mobile-user-00001", "instance_mobile_user_01.json"], 
    ["mobile_user", "mobile-user-00002", "instance_mobile_user_02.json"],
    ["realsense", "realsense-00001", "instance_realsense_01.json"], 
    ["realsense", "realsense-00002", "instance_realsense_02.json"],
    ["twitter_app", "twitter-app-00001", "instance_twitter_app_01.json"]
];
// Streams. Each row has [collection, name, fileName, typeOfRepo("ssr"|"tsr")]
const STREAMS = [
    ["mobile", "happiness", "stream_mob_happiness.json", "ssr"],
    ["mobile", "location", "stream_mob_location.json", "ssr"],
    ["iot_board", "alcohol", "stream_iot_alcohol.json", "ssr"],
    ["iot_board", "humidity", "stream_iot_humidity.json", "ssr"],
    ["iot_board", "luminance", "stream_iot_luminance.json", "ssr"],
    ["iot_board", "temperature", "stream_iot_temperature.json", "ssr"],
    ["iot_board", "distance", "stream_iot_distance.json", "ssr"],
    ["iot_board", "current", "stream_iot_current.json", "ssr"],
    ["twitter", "tweets", "stream_tweet.json", "ssr"]
];

////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////
async function _createContributorType(name) {
    console.log(name);
    return await retryOnConflict(createContributorType)(VALO,
        [TENANT, name],
        require(`./contributors/types/contribtype_${name}.json`)
    );
}

async function _registerContributorInstance([type, name, fileName]) {
    return await retryOnConflict(registerContributorInstance)(VALO,
        [TENANT, type, name],
        require(`./contributors/instances/${fileName}`)
    );
}

async function _createAndPersistStream([collection, name, fileName, repoType]) {
    await retryOnConflict(createStream)(VALO,
        [TENANT, collection, name],
        require(`./streams/schemas/${fileName}`)
    );
    await retryOnConflict(setStreamRepository)(VALO,
        [TENANT, collection, name],
        // TODO: We know this is very inefficient! 
        // ... Sync'loading the same file over and over!
        require(`./streams/schemas/repo_${repoType}.json`)
    );
}

////////////////////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////////////////////
async function main() {

    try {
        //
        // Create contributor types
        //
        await Promise.all( CONTRIBUTOR_TYPES.map(_createContributorType) );
        //
        // Register contributor intances
        //
        await Promise.all( CONTRIBUTOR_INSTANCES.map(_registerContributorInstance) );
        //
        // Create and persist streams
        //
        await Promise.all( STREAMS.map(_createAndPersistStream) );

    } catch(e) {
        console.error(e);
    }

}
main();




/*
#
# Register contributor instances
#
curl http://localhost:8888/contributors/demo/iot_board/instances/surfboard205 -X PUT --data @./contributors/instances/instance_iot_surfboard205.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/iot_board/instances/board-00001 -X PUT --data @./contributors/instances/instance_iot_board_01.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/iot_board/instances/board-00002 -X PUT --data @./contributors/instances/instance_iot_board_02.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/mobile_user/instances/mobile-user-00001 -X PUT --data @./contributors/instances/instance_mobile_user_01.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/mobile_user/instances/mobile-user-00002 -X PUT --data @./contributors/instances/instance_mobile_user_02.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/realsense/instances/realsense-00001 -X PUT --data @./contributors/instances/instance_realsense_01.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/realsense/instances/realsense-00002 -X PUT --data @./contributors/instances/instance_realsense_02.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/twitter_app/instances/twitter-app-00001 -X PUT --data @./contributors/instances/instance_twitter_app_01.json -H "Content-Type: application/json"

#
# Create & persist streams
#
curl http://localhost:8888/streams/demo/mobile/happiness -X PUT --data @./streams/schemas/stream_mob_happiness.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/mobile/happiness/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/mobile/location -X PUT --data @./streams/schemas/stream_mob_location.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/mobile/location/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/iot_board/alcohol -X PUT --data @./streams/schemas/stream_iot_alcohol.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/iot_board/alcohol/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/iot_board/humidity -X PUT --data @./streams/schemas/stream_iot_humidity.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/iot_board/humidity/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/iot_board/luminance -X PUT --data @./streams/schemas/stream_iot_luminance.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/iot_board/luminance/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/iot_board/temperature -X PUT --data @./streams/schemas/stream_iot_temperature.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/iot_board/temperature/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/iot_board/distance -X PUT --data @./streams/schemas/stream_iot_distance.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/iot_board/distance/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/twitter/tweets -X PUT --data @./streams/schemas/stream_tweet.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/twitter/tweets/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"
*/
