"use strict";
/**
 * Contributor related functions
 *
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor appends a line here)
 */
import WrapError from '../../lib_js/util_js/error';
import {
    sleep 
} from '../../lib_js/util_js/async';
import {
    createContributorType,
    registerContributorInstance,
    retryOnConflict
} from '../../lib_js/valo_sdk_js/index';
import Walker from './walker';


/**
 * Creates contributor types
 *
 * @returns null
 * @throws {CreateContributorTypeError}
 * @params {Object} - Of contributorTypes as in config file 
 */
export async function createContributorTypes( valoClient, contributorTypes ) {

    try {
        const {
            host,
            port,
            tenant 
        } = valoClient;
        const values = Object.values(contributorTypes);

        // For each entry in contributorTypes, createp parallel request to Valo
        const promises = values.map(
            async contribTypeData => {
                const {
                    name,
                    schema
                } = contribTypeData;
                await retryOnConflict(createContributorType)(
                    { valoHost: host, valoPort: port },
                    [tenant, name],
                    {schema}
                );
            }
        );
        // Wait for all requests
        await Promise.all(promises);

    } catch(e) {
        throw WrapError(new Error, {
            type: "CreateContributorTypeError",
            cause: e
        });        
    }
}

/**
 * Registers contributors
 *
 * @returns null
 * @throws {RegisterContributorError}
 * @params {Object} - Of contributors as in config file 
 */
export async function registerContributors( valoClient, contributors ) {

    try {
        const {
            host,
            port,
            tenant 
        } = valoClient;

        // For each entry in contributors, createp parallel request to Valo
        const promises = contributors.map(
            async contribData => {
                const {
                    id,
                    contributorType,
                    valoData
                } = contribData;
                await retryOnConflict(registerContributorInstance)(
                    { valoHost: host, valoPort: port },
                    [tenant, contributorType, id],
                    valoData
                );
            }
        );
        // Wait for all requests
        await Promise.all(promises);

    } catch(e) {
        throw WrapError(new Error, {
            type: "RegisterContributorError",
            cause: e
        });        
    }
}


/**
 * A "physical" contributor
 */
export class Contributor {

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
        console.log("> tick");
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

/**
 * A pool of "physical" contributors
 */
export class ContributorPool {

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

