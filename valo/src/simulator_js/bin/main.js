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
    registerContributors
} from '../lib/contributors';

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
    } catch(e) {
        console.error("Error starting simulator\n", e);
        throw e;
    }
}

//
// RUN
//
main();
