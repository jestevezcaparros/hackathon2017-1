"use strict";
/**
 * Contributors simulalor for Hackathon's streams
 *
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor appends a line here)
 */
import readConfig from '../lib/read_config';
//import startMappings from '../lib/start_mappings';

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
    let config;

    ////////////////////////////////////////////////////////////////////////////
    // Read config
    ////////////////////////////////////////////////////////////////////////////
    try {
        // Config File optionally given in 1st command line parameter
        const configFilePath = process.argv[2];

        // Read config
        config = readConfig(configFilePath);
        console.log(JSON.stringify(config, null, 4));
    } catch(e) {
        console.error("Error reading configuration", e);
        throw e;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Start simulator
    ////////////////////////////////////////////////////////////////////////////
    try {
        //await startMappings(mappings);
    } catch(e) {
        console.error("Error starting mappings\n", e);
        throw e;
    }
}

//
// RUN
//
main();
