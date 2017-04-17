"use strict";
/**
 * Binding to Valo's contributor's API
 * https://valo.io/docs/api_reference/contributors_api.html
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

 import http from 'axios';
 import {
     buildUri,
     throwValoApiError,
 } from '../../util';

 //
 // DEFINITIONS
 //
 const DEFAULT_HOST = "localhost";
 const DEFAULT_PORT = 8888;
 const DEFAULT_HEADERS = {"Content-Type" : "application/json"};

 /**
  * Create contributor type - PUT /contributors/:tenant/:type
  * https://valo.io/docs/api_reference/contributors_api.html#put-a-contributor-type
  *
  * @async
  * @returns {
    "schema": {
      "type": "record",
      "properties": {
        "contributor": { "type": "contributor" },
        "host" : {
           "type": "record",
           "properties": {
              "name": { "type": "string", "annotations":["urn:itrs:identity:name"] },
              "ip": { "type": "ip" }
          }
        }
      }
    }
  }
  * @throws {VALO.NoResponseFromValo|VALO.NotFound|VALO.Conflict}
  */
 export async function createContributorType(
     {valoHost = DEFAULT_HOST, valoPort = DEFAULT_PORT},
     [tenant, type],
     schema,
     {headers = DEFAULT_HEADERS} = {}
 ) {
     try {
         const uri = buildUri(valoHost, valoPort, "contributors", tenant, type);
         console.log("> Creating contributor type: ", uri);
         const {data: body} = await http.put(uri, schema, {headers});
         return body;
     } catch(e) {
         throwValoApiError(e,
             {
                 404 : "NotFound",
                 409 : "Conflict"
             }
         );
     }
 }

 /**
  * Register contributor instance - PUT /contributors/:tenant/:type/instances/:id
  * https://valo.io/docs/api_reference/contributors_api.html#put-a-contributor-instance
  *
  * @async
  * @returns {
      "contributor" : "9a2df62c-f97d-4971-932d-0099bc4efa49",
      "host" : {
        "name" : "ITRSPC173",
        "ip"   : "192.168.220.43"
      }
    }
  * @throws {VALO.NoResponseFromValo|VALO.NotFound|VALO.Conflict}
  */
 export async function registerContributorInstance(
     {valoHost = DEFAULT_HOST, valoPort = DEFAULT_PORT},
     [tenant, type, id],
     data,
     {headers = DEFAULT_HEADERS} = {}
 ) {
     try {
         const uri = buildUri(valoHost, valoPort, "contributors", tenant, type, "instances", id);
         console.log("> Registering contributor instance: ", uri);
         const {data: body} = await http.put(uri, data, {headers});
         return body;
     } catch(e) {
         throwValoApiError(e,
             {
                 404 : "NotFound",
                 409 : "Conflict"
             }
         );
     }
 }
