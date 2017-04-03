/**
 * Config file (temporary)
 *
 * Config should be better written in JSON files, which are parsed and joined.
 *   While we are experimenting, we will use this JS config file which is easier
 *   to load and modify.
 */

///////////////////////////////////////////////////////////////////////////////
// Clients' config
///////////////////////////////////////////////////////////////////////////////

const valoClientConfigs = {
    valo1 : {
        host : 'localhost',
        port : 8888
    }
};

const mqttClientConfigs = {
   mqtt1 : {
        host : 'iot.eclipse.org',
    }
};

///////////////////////////////////////////////////////////////////////////////
// VALO schemas
// (We write the schemas as in JSON for convenience
///////////////////////////////////////////////////////////////////////////////
const valoSchemas = {
    temperature :
    {
        "version": "",
        "config": {},
        "topDef": {
            "type": "record",
            "properties": {
                "value" : {"type": "double"}
            }
        }
    }
};

///////////////////////////////////////////////////////////////////////////////
// Map sources to valo streams
///////////////////////////////////////////////////////////////////////////////

const mappings = [

    {
        "transportType" : "mqtt",
        "transportClient" : mqttClientConfigs.mqtt1,
        "transportOrigin" : '/jonthebeach/sensors/temperature',

        "valoClient" : valoClientConfigs.valo1,
        "valoTenant" : "demo",
        "valoCollection" : "iot",
        "valoStream" : "temperature",
        "valoSchema" : valoSchemas.temperature,
        "valoRepo" : "tsr" // "tsr"|"ssr"|null

    }


];

///////////////////////////////////////////////////////////////////////////////
// Config object
///////////////////////////////////////////////////////////////////////////////

const config = {

    mappings
};

export default config;
