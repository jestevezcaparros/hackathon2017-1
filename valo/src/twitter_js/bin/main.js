"use strict";
/**
 *
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor appends a line here)
 */
import readConfig from '../lib/read_config';
import startMappings from '../lib/start_mappings';

/**
 * Main
 *
 */
async function main() {

    console.log(`>>> Twitter Injector Starting at ${Date()} ...`);

    ////////////////////////////////////////////////////////////////////////////
    // Context
    ////////////////////////////////////////////////////////////////////////////
    let config,
        mappings;

    ////////////////////////////////////////////////////////////////////////////
    // Read config
    ////////////////////////////////////////////////////////////////////////////
    try {
        config = readConfig();
        mappings = config.mappings;
        console.log(JSON.stringify(config, null, 4));
        if (!mappings) throw {msg: "Missing mappings in configuration"};
    } catch(e) {
        console.error("Error reading configuration", e);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Start mappings
    ////////////////////////////////////////////////////////////////////////////
    try {
        await startMappings(mappings);
    } catch(e) {
        console.error("Error starting mappings\n", e);
    }
}

//
// RUN
//
main();
