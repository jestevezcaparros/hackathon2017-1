"use strict";
/** 
 * Event simulator for Valo
 */
import {
    publishEventToStream
} from '../../lib_js/valo_sdk_js';

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
console.log(locationEvent);
console.log(publishEventToStream);

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

    tick() {
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

(async function main() {
    const w = new Walker(0.000001,{initPosX: 0, initPostY: 0});
    w.tick();
    console.log(w.position);
    await sleep(100);
    w.tick();
    console.log(w.position);
    await sleep(100);
    w.tick();
    console.log(w.position);
    await sleep(100);
    w.tick();
    console.log(w.position);
    while (true) {
        await sleep(100);
        w.tick();
        console.log(w.position);
    }
})();

