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
                "timestamp" : {"type": "datetime", "annotations":  ["urn:itrs:default-timestamp"]},
                "origin" : {"type": "string"}
            }
        }
    },
    temperatureVinicius : {
        "version": "",
        "config": {},
        "topDef": {
            "type": "record",
            "properties": {
                "contributor" : {
                    "type" : "contributor",
                    "definition" : "iot_board"
                },
                "value" : {"type": "double"},
                "units" : {"type": "string"},
                "timestamp" : {"type": "datetime", "annotations":  ["urn:itrs:default-timestamp"]},
                "geo_lat" : {"type": "double"},
                "geo_long" : {"type": "double"}
            }
        }
    },

    iot_alcohol : {
        "version": "1.0",
        "config": {},
        "topDef": {
            "type": "record",
            "properties": {
                "contributor": {
                    "type":"contributor", "definition":"iot_board"
                },
                "timestamp": {
                    "type": "datetime",
                    "annotations": ["urn:itrs:default-timestamp"]
                },
                "position": {
                    "type": "record",
                    "properties": {
                        "latitude" : {"type": "double"},
                        "longitude" : {"type": "double"}
                    }
                },
                "alcohol" : {"type": "double"},
                "units" : {"type": "string"}
            }
        }
    },
    iot_temperature : {
        "version": "1.0",
        "config": {},
        "topDef": {
            "type": "record",
            "properties": {
                "contributor": {
                    "type":"contributor", "definition":"iot_board"
                },
                "timestamp": {
                    "type": "datetime",
                    "annotations": ["urn:itrs:default-timestamp"]
                },
                "position": {
                    "type": "record",
                    "properties": {
                        "latitude" : {"type": "double"},
                        "longitude" : {"type": "double"}
                    }
                },
                "temperature" : {"type": "double"},
                "units" : {"type": "string"}
            }
        }
    },
    iot_distance : {
        "version": "1.0",
        "config": {},
        "topDef": {
            "type": "record",
            "properties": {
                "contributor": {
                    "type":"contributor", "definition":"iot_board"
                },
                "timestamp": {
                    "type": "datetime",
                    "annotations": ["urn:itrs:default-timestamp"]
                },
                "position": {
                    "type": "record",
                    "properties": {
                        "latitude" : {"type": "double"},
                        "longitude" : {"type": "double"}
                    }
                },
                "distance" : {"type": "double"},
                "units" : {"type": "string"}
            }
        }
    },
    iot_humidity : {
        "version": "1.0",
        "config": {},
        "topDef": {
            "type": "record",
            "properties": {
                "contributor": {
                    "type":"contributor", "definition":"iot_board"
                },
                "timestamp": {
                    "type": "datetime",
                    "annotations": ["urn:itrs:default-timestamp"]
                },
                "position": {
                    "type": "record",
                    "properties": {
                        "latitude" : {"type": "double"},
                        "longitude" : {"type": "double"}
                    }
                },
                "humidity" : {"type": "double"},
                "units" : {"type": "string"}
            }
        }
    },
    iot_luminance : {
        "version": "1.0",
        "config": {},
        "topDef": {
            "type": "record",
            "properties": {
                "contributor": {
                    "type":"contributor", "definition":"iot_board"
                },
                "timestamp": {
                    "type": "datetime",
                    "annotations": ["urn:itrs:default-timestamp"]
                },
                "position": {
                    "type": "record",
                    "properties": {
                        "latitude" : {"type": "double"},
                        "longitude" : {"type": "double"}
                    }
                },
                "luminance" : {"type": "double"},
                "units" : {"type": "string"}
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
        "valoCollection" : "iot_board",
        "valoStream" : "temperature",
        "valoSchema" : valoSchemas.iot_temperature,
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
        "valoSchema" : valoSchemas.iot_humidity,
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
        "valoSchema" : valoSchemas.iot_alcohol,
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
        "valoSchema" : valoSchemas.iot_luminance,
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
        "valoSchema" : valoSchemas.iot_distance,
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
