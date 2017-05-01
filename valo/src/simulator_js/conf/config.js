"use strict";
/**
 * Config file (temporary)
 *
 * Config should be better written (really?) in JSON files, which are parsed and joined.
 *   While we are experimenting, we will use this JS config file which is easier
 *   to load and modify.
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor appends a line here)
 */
import {
    uniformGenerator,
    constantGenerator
} from '../../lib_js/util_js/random';
import {
    publishEventToStream
} from '../../lib_js/valo_sdk_js/index';


///////////////////////////////////////////////////////////////////////////////
// CONSTANTS
/////////////////////////////////////////////////////////////////////////////// 
const LA_TERMICA_COORDINATES = {
  lat: 36.689150,
  lon: -4.445000,
  radius: 80,
  bounds:{
    sw:{
      lat: 36.688845,
      lon: -4.445961
    },
    ne: {
      lat: 36.689417,
      lon: -4.443649
    }
  }
};
// Imagine a grid on the map, with GRID_RESOLUTION square tiles of side SIZE long
const GRID_RESOLUTION = 1000;
const GRID_SIZE = LA_TERMICA_COORDINATES.bounds.ne.lon 
    - LA_TERMICA_COORDINATES.bounds.sw.lon;
// Center
const ORIGIN_LON = LA_TERMICA_COORDINATES.lon;
const ORIGIN_LAT = LA_TERMICA_COORDINATES.lat;
const MIN_LON = LA_TERMICA_COORDINATES.bounds.sw.lon;
const MIN_LAT = LA_TERMICA_COORDINATES.bounds.sw.lat;
const MAX_LON = LA_TERMICA_COORDINATES.bounds.ne.lon;
const MAX_LAT = LA_TERMICA_COORDINATES.bounds.ne.lat;

///////////////////////////////////////////////////////////////////////////////
// VALO Clients config
///////////////////////////////////////////////////////////////////////////////
const valoClient = {
    host : 'localhost',
    port : 8888,
    tenant : 'demo'
};

///////////////////////////////////////////////////////////////////////////////
// WALKERS - Acceleration generators for walkers
///////////////////////////////////////////////////////////////////////////////
// Walker resolution
const TUNE_THIS = 0.00001; // Tune this param to adjust the size of the steps
const WALKER_RESOLUTION = TUNE_THIS * 1 / GRID_RESOLUTION;

// Acceleration generators
const accGeneratorMobile = uniformGenerator(-1,1);
const accGeneratorIotBoard = constantGenerator(0,0); //Acceleration always 0

// Walker Data Configs
const walkerDataConfigs = {
    walkerMobileDefault : {
        resolution : WALKER_RESOLUTION,
        initPosVel : {
            initPosX : ORIGIN_LON,
            initPosY : ORIGIN_LAT,
            initVelX : 0,
            initVelY : 0
        },
        accRandomGenerator : accGeneratorMobile
    }
}


///////////////////////////////////////////////////////////////////////////////
// VALO CONTRIBUTORS
///////////////////////////////////////////////////////////////////////////////
const contributorTypes = {
    mobile_user : {
        name: "mobile_user",
        onTickFunction: onTickMobile,
        schema: {
            "type": "record",
            "properties": {
                "id": {
                    "type": "contributor"
                },
                "user": {
                    "type" : "record",
                    "properties" : {
                        "name" : {"type": "string"},
                        "typeOfParticipant" : {"type" : "string"},
                        "role" : {"type" : "string"},
                        "country" : {"type" : "string"},
                        "gender" : {"type" : "string"}
                    }
                }
            }
        }
    },
    iot_board : {
        name: "iot_board",
        onTickFunction: onTickIotBoard,
        schema: {
            "type": "record",
            "properties": {
                "id": {
                    "type": "contributor"
                },
                "model" : {"type" : "string"},
                "vendor" : {"type" : "string"}
            }
        }
    }
}

const contributors = [
    // IOT BOARDS
    {
        id : "fake-board-00001",
        contributorType: "iot_board",
        valoData: {
            "id" : "fake-board-00001",
            "model" : "fake-surfboard",
            "vendor" : "FAKE"
        },
        walkerData : {
            resolution : WALKER_RESOLUTION,
            initPosVel : {
                initPosX : ORIGIN_LON - 100 * GRID_SIZE,
                initPosY : ORIGIN_LAT - 100 * GRID_SIZE,
                initVelX : 0,
                initVelY : 0
            },
            accRandomGenerator : accGeneratorIotBoard
        }
    },
    {
        id : "fake-board-00002",
        contributorType: "iot_board",
        valoData: {
            "id" : "fake-board-00002",
            "model" : "fake-surfboard",
            "vendor" : "FAKE"
        },
        walkerData : {
            resolution : WALKER_RESOLUTION,
            initPosVel : {
                initPosX : ORIGIN_LON + 100 * GRID_SIZE,
                initPosY : ORIGIN_LAT - 100 * GRID_SIZE,
                initVelX : 0,
                initVelY : 0
            },
            accRandomGenerator : accGeneratorIotBoard
        }
    },
    {
        id : "fake-board-00003",
        contributorType: "iot_board",
        valoData: {
            "id" : "fake-board-00003",
            "model" : "fake-surfboard",
            "vendor" : "FAKE"
        },
        walkerData : {
            resolution : WALKER_RESOLUTION,
            initPosVel : {
                initPosX : ORIGIN_LON + 100 * GRID_SIZE,
                initPosY : ORIGIN_LAT + 100 * GRID_SIZE,
                initVelX : 0,
                initVelY : 0
            },
            accRandomGenerator : accGeneratorIotBoard
        }
    },
    {
        id : "fake-board-00004",
        contributorType: "iot_board",
        valoData: {
            "id" : "fake-board-00004",
            "model" : "fake-surfboard",
            "vendor" : "FAKE"
        },
        walkerData : {
            resolution : WALKER_RESOLUTION,
            initPosVel : {
                initPosX : ORIGIN_LON - 100 * GRID_SIZE,
                initPosY : ORIGIN_LAT + 100 * GRID_SIZE,
                initVelX : 0,
                initVelY : 0
            },
            accRandomGenerator : accGeneratorIotBoard
        }
    },

    // MOBILE USERS
    {
        id : "fake-mobile-user-00001",
        contributorType: "mobile_user",
        valoData: {
            "id" : "fake-mobile-user-00001",
            "user" : {
                "name" : "fake-mobile-user-00001",
                "typeOfParticipant" : "ORGANIZER",
                "company" : "FAKE",
                "country" : "Spain",
                "role" : "Developer"
            }
        },
        walkerData : walkerDataConfigs.walkerMobileDefault
    },
    {
        id : "fake-mobile-user-00002",
        contributorType: "mobile_user",
        valoData: {
            "id" : "fake-mobile-user-00002",
            "user" : {
                "name" : "fake-mobile-user-00002",
                "typeOfParticipant" : "SPEAKER",
                "company" : "FAKE",
                "country" : "Spain",
                "role" : "Developer"
            }
        },
        walkerData : walkerDataConfigs.walkerMobileDefault
    },
    {
        id : "fake-mobile-user-00003",
        contributorType: "mobile_user",
        valoData: {
            "id" : "fake-mobile-user-00003",
            "user" : {
                "name" : "fake-mobile-user-00003",
                "typeOfParticipant" : "ATTENDEE",
                "company" : "FAKE",
                "country" : "Spain",
                "role" : "Developer"
            }
        },
        walkerData : walkerDataConfigs.walkerMobileDefault
    },
    {
        id : "fake-mobile-user-00004",
        contributorType: "mobile_user",
        valoData: {
            "id" : "fake-mobile-user-00004",
            "user" : {
                "name" : "fake-mobile-user-00004",
                "typeOfParticipant" : "GATECRASHER",
                "company" : "FAKE",
                "country" : "Spain",
                "role" : "Developer"
            }
        },
        walkerData : walkerDataConfigs.walkerMobileDefault
    },
];


///////////////////////////////////////////////////////////////////////////////
// VALO STREAMS
// (We write the schemas as in JSON for convenience
///////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////
// Export config object
///////////////////////////////////////////////////////////////////////////////
const config = {
    contributorTypes,
    contributors,
    valoClient
};
export default config;

///////////////////////////////////////////////////////////////////////////////
// Contributor custom functions (onTick functions)
// Indexed by contributorType
///////////////////////////////////////////////////////////////////////////////
//
// Mobile users - Custom contributor's onTick() function
//
async function onTickMobile (
    contributorType, contributorId,
    valoHost, valoPort, valoTenant,
    position, state
) {
    const STREAM_COLLECTION = "mobile";
    const STREAM_NAME_LOCATION = "location";
    const STREAM_NAME_HAPPINESS = "happiness";
    const DEBOUNCE_TIME_LOCATION = 1000;
    const DEBOUNCE_TIME_HAPPINESS = 5000;
    const LIKELIHOOD_PUBLISHING_HAPPINESS = 0.5

    // Intervals in milliseconds
    const elapsedIntervalLocationUpdate = state.timestampLastLocationUpdate ? 
        Date.now() - state.timestampLastLocationUpdate: null;
    const elapsedIntervalHappinessUpdate = state.timestampLastHappinessUpdate ? 
        Date.now() - state.timestampLastHappinessUpdate: null;
    
    //
    // Update Location in Valo if enough time has passed
    //
    if (
        elapsedIntervalLocationUpdate === null 
        || elapsedIntervalLocationUpdate > DEBOUNCE_TIME_LOCATION
    ) {
       // Build location event
       const locationEvt = {
           "contributor" : contributorId,
           "timestamp" : new Date(),
           "position" : {
               "longitude" : position.x,
               "latitude" : position.y
           }
       };
   
       // Publish event(s) into Valo
       console.log(locationEvt);
       await publishEventToStream(
           { valoHost, valoPort },
           [valoTenant, STREAM_COLLECTION , STREAM_NAME_LOCATION],
           locationEvt
       );
       state.timestampLastLocationUpdate = Date.now();
    }  

    //
    // Update Happiness in Valo if enough time has passed
    //
    if (
        elapsedIntervalHappinessUpdate === null 
        || elapsedIntervalHappinessUpdate > DEBOUNCE_TIME_HAPPINESS
        && Math.random() < LIKELIHOOD_PUBLISHING_HAPPINESS
    ) {
       // Build location event
       const happinessEvt = {
           "contributor" : contributorId,
           "timestamp" : new Date(),
           "position" : {
               "longitude" : position.x,
               "latitude" : position.y
           },
           "happiness" :  Math.floor( 3 * Math.random() - 1 ) // Happiness interval is in [-1,0, +1]
       };
   
       // Publish event(s) into Valo
       console.log(happinessEvt);
       await publishEventToStream(
           { valoHost, valoPort },
           [valoTenant, STREAM_COLLECTION , STREAM_NAME_HAPPINESS],
           happinessEvt
       );
       state.timestampLastHappinessUpdate = Date.now();
    }  
}
//
// Iot Boards - Custom contributor's onTick() function
//
async function onTickIotBoard(
    contributorType, contributorId,
    valoHost, valoPort, valoTenant,
    position, state
) {
    const STREAM_COLLECTION = "iot_board";
    const STREAM_NAME_LUMINANCE = "luminance";
    const STREAM_NAME_TEMPERATURE = "temperature";
    const STREAM_NAME_HUMIDITY = "humidity";
    const STREAM_NAME_ALCOHOL = "alcohol";
    const STREAM_NAME_DISTANCE = "distance";

    const DEBOUNCE_TIME = 1000 * 10;

    // Intervals in milliseconds
    const elapsedInterval = state.timestampLast ? 
        Date.now() - state.timestampLast : null;

    //
    // Update in Valo only if enough time has passed
    //
    if (
        elapsedInterval === null 
        || elapsedInterval > DEBOUNCE_TIME
    ) {
        //
        // Build events
        //
        const luminanceEvt = {
            "contributor" : contributorId,
            "timestamp" : new Date(),
            "position" : {
                "longitude" : position.x,
                "latitude" : position.y
            },
            "luminance" :  Math.random(), //TODO - Fix range
            "units" : "nit"
        };
        //console.log(luminanceEvt);
        const temperatureEvt = {
            "contributor" : contributorId,
            "timestamp" : new Date(),
            "position" : {
                "longitude" : position.x,
                "latitude" : position.y
            },
            "temperature" :  Math.random(), //TODO - Fix range
            "units" : "celsius"
        };
        console.log(temperatureEvt);
        const humidityEvt = {
            "contributor" : contributorId,
            "timestamp" : new Date(),
            "position" : {
                "longitude" : position.x,
                "latitude" : position.y
            },
            "humidity" :  Math.random(), //TODO - Fix range
            "units" : "%"
        };
        //console.log(humidityEvt);
        const alcoholEvt = {
            "contributor" : contributorId,
            "timestamp" : new Date(),
            "position" : {
                "longitude" : position.x,
                "latitude" : position.y
            },
            "alcohol" :  Math.random(), //TODO - Fix range
            "units" : "%"
        };
        //console.log(alcoholEvt);
        const distanceEvt = {
            "contributor" : contributorId,
            "timestamp" : new Date(),
            "position" : {
                "longitude" : position.x,
                "latitude" : position.y
            },
            "distance" :  Math.random(), //TODO - Fix range
            "units" : "cm"
        };
        //console.log(distanceEvt);
   
        // Publish event(s) into Valo
        await publishEventToStream(
            { valoHost, valoPort },
            [valoTenant, STREAM_COLLECTION , STREAM_NAME_TEMPERATURE],
            temperatureEvt
        );

        // Update timestampLast
        state.timestampLast = Date.now();
    }  
}
