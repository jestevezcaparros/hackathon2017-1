"use strict";
/**
 * Examples about how Valo contributors API is used
 * https://valo.io/docs/api_reference/contributors_api.html
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor append a line here)
 */
import * as contributors from '../api/contributors';
import {
    retryOnConflict
} from '../index';


//
// DEFINITIONS
//
const LOCAL_VALO = {valoHost: "localhost", valoPort: 8888};
const TENANT = "myTenant";
const CONTRIBUTOR_TYPE = "probes";
const CONTRIBUTOR_SCHEMA = {
    "schema": {
      "type": "record",
      "properties": {
        "contributor": { "type": "contributor", "definition": "probe"},
        "host" : {
           "type": "record",
           "properties": {
              "name": { "type": "string", "annotations":["urn:itrs:identity:name"] },
              "ip": { "type": "ip" }
          }
        }
      }
    }
};
const CONTRIBUTOR_ID = "9a2df62c-f97d-4971-932d-0099bc4efa48";

//
// Main
//
async function main() {

    try {
        //
        // Create contributor type
        //
        const response = await retryOnConflict(contributors.createContributorType)(
            LOCAL_VALO,
            [TENANT, CONTRIBUTOR_TYPE],
            CONTRIBUTOR_SCHEMA
        );

        //
        // Register contributor instance
        //
        const response2 = await retryOnConflict(contributors.registerContributorInstance)(
            LOCAL_VALO,
            [TENANT, CONTRIBUTOR_TYPE, CONTRIBUTOR_ID],
            {
                "contributor" : CONTRIBUTOR_ID,
                "host" : {
                    "name" : "ITRSPC173",
                    "ip"   : "192.168.220.43"
                }
            }
        );

    } catch(e)  {
        console.error(e);
        throw e;
    }

}
main();
