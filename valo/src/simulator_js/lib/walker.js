"use strict";
/**
 * Walkers - 2D position ramdom generators
 *
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor appends a line here)
 */
import {
    uniformGenerator
} from '../../lib_js/util_js/random';

/** 
 * Walker class
 */
export default class Walker {
    /**
     * @param {Number} - Resolution ('step size') at which the walker moves
     *                   Adjust it upon creation to fit to your walking space.
     * @param {Object} - Initial position and veolocity (x,y coordinates)
     * @param {Function} - Random generator, used for updating acceleration
     */
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

    /** 
     * Update walker position & velocity & acceleration
     */
    walk() {
        // Update position and velocity 
        updateWalkerPosition(this.state, this.resolution);
        // Updtate walker acceleration (random)
        this.state.acc = this.accelerationRandomGenerator(); 
    }
    
    /** 
     * Returns walker's position {x,y}
     * @getter
     */
    get position() {
        return this.state.pos;
    }
}

///////////////////////////////////////////////////////////////////////////////
// PRIVATE
///////////////////////////////////////////////////////////////////////////////
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
