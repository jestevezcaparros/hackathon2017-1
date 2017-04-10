"use strict";
/**
 * Main file for injecting data from transports (queue brokers, etc) into Valo
 *   There can be:
 *     - Multiple instances of Valo
 *     - Multiple innstances of different types of supported transports
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

    console.log(`>>> Transport Injector Starting at ${Date()} ...`);

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
