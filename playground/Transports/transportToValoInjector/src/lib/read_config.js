/**
 * Reads config from config files
 *   Initial version reads from JS file. Eventually moved to a few JSON files
 */
import config from '../../conf/config';


function readConfig() {
    console.log(">>> Reading Config");
    // For now this is this simple!
    return config;
}

export default readConfig;
