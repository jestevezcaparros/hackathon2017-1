"use strict";
/**
 * Contributors simulalor for Hackathon's streams - Draft-example
 *
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor appends a line here)
 */
import {
    publishEventToStream
} from '../../lib_js/valo_sdk_js';
import WrapError from '../../lib_js/util_js/error';

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


//
// Simulate events for /streams/demo/mobile/location
//

const locationEvent = {
    "contributor" : "mobile-user-00001",
    "timestamp" : "2017-04-20T10:52:28.638Z",
    "position" : {
        "latitude" : LA_TERMICA_COORDINATES.lat,
        "longitude" : LA_TERMICA_COORDINATES.lon 
    }
};

debugger

//
// AUX
//
function sleep(millisecs) {
    return new Promise( (resolve, reject) => {
        setTimeout(resolve, millisecs);   
    });
}

//
// Ramdom walker
//
function uniformGenerator(min, max) {
    return () => {
        return {
            x: Math.random() * (max-min) + min,
            y: Math.random() * (max-min) + min
        };
    };
}

function updateWalkerPosition(walkerState, resolution) {
    // Two impurities here:
    // - Consciously mutates! walker's state and returns reference to it
    // - Gets current time with Date.now()
    
    //
    // Update timestamp and get time interval
    //
    const now = Date.now();
    const interval_ms = now - walkerState.timestamp;
    // Mutate!
    walkerState.timestamp = now; 

    //
    // Update position
    //
    walkerState.pos.x = walkerState.vel.x * interval_ms * resolution + walkerState.pos.x;
    walkerState.pos.y = walkerState.vel.y * interval_ms * resolution + walkerState.pos.y;
    //
    // Update velocity
    //
    walkerState.vel.x = walkerState.acc.x * interval_ms + walkerState.vel.x;
    walkerState.vel.y = walkerState.acc.y * interval_ms + walkerState.vel.y;
    
    return walkerState; 
}


class Walker {
    constructor(
        resolution=1, 
        {
            initPosX = 0, 
            initPosY = 0,
            initVelX = 0,
            initVelY = 0
        } = {},
        accelerationRandomGenerator = uniformGenerator(-1,1)
    ) {
        const {
            x: initAccX,
            y: initAccY
        } = accelerationRandomGenerator();

        // Composition of behaviour (strategy)
        this.accelerationRandomGenerator = accelerationRandomGenerator;
        // Constant attributes
        this.resolution = resolution;
        // State
        this.state = {
            pos: {
                x: initPosX,
                y: initPosY
            },   
            vel: {
                x: initVelX,
                y: initVelY
            },
            acc: {
                x: initAccX,
                y: initAccY
            },
            timestamp: Date.now(),
        };
    }

    walk() {
        //console.log("TICK: ",this.state);

        // Update walker position & velocity
        updateWalkerPosition(this.state, this.resolution);
        // Updtate walker acceleration (random)
        //this.state.acc = accelerationRandomGenerator(); 
        this.state.acc = this.accelerationRandomGenerator(); 
    }
    
    get position() {
        return this.state.pos;
    }
}

//
// A contributor
//
class Contributor {

    constructor(
        contributorType,
        contributorId,
        onTick, // Function 
        walker = new Walker(0.000001, {initPosX:0, initPosY:0}),
        { 
            valoHost = "localhost",
            valoPort = "8888",
            valoTenant = "demo"
        } = {}
    ) {
        console.log("constructor");

        // Behaviors
        this.onTick = onTick;
        this.walker = walker;
        // Attributes
        this.contributor = {
            type : contributorType,
            id : contributorId
        };
        this.valo = {
            host : valoHost,
            port : valoPort,
            tenant : valoTenant
        };
        // State
        this.state = {};
    }

    tick() {
        console.log("tick");
        //
        // Update my position
        //
        this.walker.walk();

        //
        //  Call onTick
        //
        this.onTick(
            this.contributor.type,
            this.contributor.id,
            this.valo.host,
            this.valo.port,
            this.valo.tenant,
            this.position,
            this.state
        );
        
    }

    get position() {
        return this.walker.position;
    }
}

async function onTick1 (
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

class ContributorPool {

    constructor(interval=1000) {
        this.interval = interval;
        this.contributors = [];
        this.state = {
            running: false
        };
    }

    addContributor(contributor) {
        if (contributor.constructor !== Contributor) {
            const e = WrapError(new Error(), {
                type: "ContributorExpected",
                msg: ".addContributor() expects a contributor!"
            });
            throw e;
        } 
        this.contributors.push(contributor);
    }
    
    async run(interval) {
        const t_interval = interval || this.interval;
        console.log(">>> Starting pool of contributors..."); 
        if (! this.contributors.length > 0) {
            console.log(">>> Pool has no contributors (yet). Refusing to start pool");
            return;
        }
        this.state.running = true;


        let sub_interval;
        while(this.state.running) {
            // Call tick() for all contributors in the pool...
            this.contributors.forEach(
                contributor => contributor.tick()
            );        
            // ... then wait for a while
            await sleep(t_interval);
        }
    }

    halt() {
        console.log(">>> Stopping pool of contributors");
        this.state.running = false;
    }

}

(async function main() {
    const c1 = new Contributor(
        "mobile_user",
        "mobile-user-00001",
        onTick1
    );
    const c2 = new Contributor(
        "mobile_user",
        "mobile-user-00002",
        onTick1
    );
    const c3 = new Contributor(
        "mobile_user",
        "mobile-user-00003",
        onTick1
    );
    //c.tick();

    const p = new ContributorPool(1000);
    p.addContributor(c1);
    p.addContributor(c2);
    p.addContributor(c3);
    p.run();

    await sleep(100000);
    p.halt();

    //p.show();

    /*
    while (true) {
        await sleep(1000);
        c.tick();
    }
    */
})();

