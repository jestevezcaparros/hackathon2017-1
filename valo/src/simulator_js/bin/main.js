"use strict";
/**
 * Contributors simulalor for Hackathon's streams
 *
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor appends a line here)
 */
import readConfig from '../lib/read_config';
import {
    createContributorTypes,
    registerContributors,
    Contributor,
    ContributorPool
} from '../lib/contributors';
import Walker from '../lib/walker';

///////////////////////////////////////////////////////////////////////////////
// DEFINITIONS
///////////////////////////////////////////////////////////////////////////////
const LOOP_INTERVAL = 1000; // In milliseconds

//
// MAIN
//
async function main() {

    console.log(`*******************************************************************************`);
    console.log(`*  Contributors simulator starting at ${Date()} ...`);
    console.log(`*  The simulator publish fake events to Valo`);
    console.log(`*  (help) You can pass your file config name as a parameter.`);
    console.log(`*  (help) Otherwise, the default one in conf/config.json will be used`);
    console.log(`*******************************************************************************`);
    console.log();

    ////////////////////////////////////////////////////////////////////////////
    // Context
    ////////////////////////////////////////////////////////////////////////////
    let config,
        valoClient,
        contributorTypes,
        contributors;

    ////////////////////////////////////////////////////////////////////////////
    // Read config
    ////////////////////////////////////////////////////////////////////////////
    try {
        // Config File optionally given in 1st command line parameter
        const configFilePath = process.argv[2];

        // Read config
        config = readConfig(configFilePath);
        valoClient = config.valoClient;
        contributorTypes = config.contributorTypes;
        contributors = config.contributors;
        if (!valoClient) throw {msg: "Missing valoClient in configuration"};
        if (!contributorTypes) throw {msg: "Missing contributorTypes in configuration"};
        if (!contributors) throw {msg: "Missing contributors in configuration"};
    } catch(e) {
        console.error("Error reading configuration", e);
        throw e;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Start simulator
    ////////////////////////////////////////////////////////////////////////////
    try {
        console.log(">>> Starting simulator...");

        ///////////////////////////////////////////////////////////////////////
        // Create Contributor Types
        ///////////////////////////////////////////////////////////////////////
        await createContributorTypes(valoClient, contributorTypes);

        ///////////////////////////////////////////////////////////////////////
        // Register Contributors
        ///////////////////////////////////////////////////////////////////////
        await registerContributors(valoClient, contributors);

        ///////////////////////////////////////////////////////////////////////
        // Create a contributor pool
        ///////////////////////////////////////////////////////////////////////
        const pool = new ContributorPool(LOOP_INTERVAL);

        ///////////////////////////////////////////////////////////////////////
        // Add contributors to contributor pool
        ///////////////////////////////////////////////////////////////////////
        const c = new Contributor(
            "mobile_user",
            "mobile-user-00001",
            () => {
                console.log("here");
            }
        );
        c.tick();
        pool.addContributor(c);
        contributors.forEach(
            contributorInfo => {
                const {
                    id,
                    contributorType,
                    walkerData 
                } = contributorInfo;
                const {
                    resolution,
                    initPosVel,
                    accRandomGenerator 
                } = walkerData;
                const onTick = contributorTypes[contributorType].onTickFunction;
                const contributor = new Contributor(
                    contributorType,
                    id,
                    onTick,
                    new Walker(resolution, initPosVel, accRandomGenerator),
                    valoClient
                );
                // Add contributor to pool
                pool.addContributor(contributor); 
            }
        );
        ///////////////////////////////////////////////////////////////////////
        // Start the contributor pool
        ///////////////////////////////////////////////////////////////////////
        pool.run();
        
        
    } catch(e) {
        console.error("Error starting simulator\n", e);
        throw e;
    }
}

//
// RUN
//
main();
