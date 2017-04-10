"use strict";
/**
 * Config file (temporary)
 *
 * Config should be better written in JSON files, which are parsed and joined.
 *   While we are experimenting, we will use this JS config file which is easier
 *   to load and modify.
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor appends a line here)
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
    single :
    {
        "version": "",
        "config": {},
        "topDef": {
            "type": "record",
            "properties": {
                "value" : {"type": "double"},
                "origin" : {"type": "string"}
            }
        }
    },
    singleWithTimestamp :
    {
        "version": "",
        "config": {},
        "topDef": {
            "type": "record",
            "properties": {
                "value" : {"type": "double"},
                "timestamp" : {"type": "datetime"},
                "origin" : {"type": "string"}
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
        "valoSchema" : valoSchemas.singleWithTimestamp,
        "valoRepo" : "tsr" // "tsr"|"ssr"|null
    },
    {
        "transportType" : "mqtt",
        "transportClient" : mqttClientConfigs.mqtt1,
        "transportOrigin" : '/jonthebeach/sensors/humidity',
        "valoClient" : valoClientConfigs.valo1,
        "valoTenant" : "demo",
        "valoCollection" : "iot",
        "valoStream" : "humidity",
        "valoSchema" : valoSchemas.singleWithTimestamp,
        "valoRepo" : "tsr" // "tsr"|"ssr"|null
    },
    {
        "transportType" : "mqtt",
        "transportClient" : mqttClientConfigs.mqtt1,
        "transportOrigin" : '/jonthebeach/sensors/alcohol',
        "valoClient" : valoClientConfigs.valo1,
        "valoTenant" : "demo",
        "valoCollection" : "iot",
        "valoStream" : "alcohol",
        "valoSchema" : valoSchemas.singleWithTimestamp,
        "valoRepo" : "tsr" // "tsr"|"ssr"|null
    },
    {
        "transportType" : "mqtt",
        "transportClient" : mqttClientConfigs.mqtt1,
        "transportOrigin" : '/jonthebeach/sensors/light',
        "valoClient" : valoClientConfigs.valo1,
        "valoTenant" : "demo",
        "valoCollection" : "iot",
        "valoStream" : "light",
        "valoSchema" : valoSchemas.singleWithTimestamp,
        "valoRepo" : "tsr" // "tsr"|"ssr"|null
    },
    {
        "transportType" : "mqtt",
        "transportClient" : mqttClientConfigs.mqtt1,
        "transportOrigin" : '/jonthebeach/sensors/distance',
        "valoClient" : valoClientConfigs.valo1,
        "valoTenant" : "demo",
        "valoCollection" : "iot",
        "valoStream" : "distance",
        "valoSchema" : valoSchemas.singleWithTimestamp,
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
