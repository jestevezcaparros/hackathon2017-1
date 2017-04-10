"use strict";
/**
 * Reads config from config files
 *   Initial version reads from JS file.
 *   (Eventually could be moved to a few JSON files).
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor appends a line here)
 */
import config from '../conf/config';


function readConfig() {
    console.log(">>> Reading Config");
    // For now this is that simple!
    return config;
}

export default readConfig;
