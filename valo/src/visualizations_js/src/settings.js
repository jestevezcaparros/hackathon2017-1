"use strict";
/**
 * Settings module
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author (Each contributor append a line here)
 */
export const DEBUG = true;
export const HOST = {valoHost: "192.168.35.19", valoPort: 8888};
export const TENANT = 'demo';
export const QUERY_MOB_HAPPINESS = 'from /streams/demo/jotb/mob_happiness';
export const QUERY_MOB_LOCATION = 'from /streams/demo/jotb/mob_location';
export const ICON_URL = 'http://localhost:8080/icons/'
export const MAP_CONTAINER_CSS_SELECTOR = '.map-container';
export const LA_TERMICA_COORDINATES = {
  lat: 36.689150,
  lon: -4.445000
};
// export const ITRS_COORDINATES = {
//     lat: 36.734684,
//     lon: -4.557648
// }
export const MAP_OPTIONS = {
    zoom: 19,
    disableDefaultUI: true,
    backgroundColor: "#bbb",
    center: LA_TERMICA_COORDINATES
};
export const AUDITORIO_POLYGON = [
    {lat: 36.689026, lng: -4.444346},
    {lat: 36.688893, lng: -4.443849},
    {lat: 36.689431, lng: -4.443629},
    {lat: 36.689561, lng: -4.444127}
]

export const MOLLETE_POLYGON = [
    {lat: 36.689386, lng: -4.445099},
    {lat: 36.689362, lng: -4.445013},
    {lat: 36.689093, lng: -4.445118},
    {lat: 36.689121, lng: -4.445215}
]

export const PITUFO_POLYGON = [
    {lat: 36.689041, lng: -4.445392},
    {lat: 36.689020, lng: -4.445292},
    {lat: 36.688786, lng: -4.445391},
    {lat: 36.688804, lng: -4.445473}
]

export const ENTRANCE_POLYGON = [
    {lat: 36.689497, lng: -4.445576},
    {lat: 36.689401, lng: -4.445177},
    {lat: 36.689353, lng: -4.445199},
    {lat: 36.689451, lng: -4.445598}
]

export const BATHROOM_POLYGON = [
    {lat: 36.689141, lng: -4.445064},
    {lat: 36.689114, lng: -4.444961},
    {lat: 36.689060, lng: -4.444985},
    {lat: 36.689084, lng: -4.445088}
]

export const POLYGON_ROOM_STYLE = {
    strokeColor: 'rgba(27, 217, 221, 1)',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: 'rgba(27, 217, 221, 1)',
    fillOpacity: 1
}

export const POLYGON_BATHROOM_STYLE = {
    strokeColor: '#009933',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: '#009933',
    fillOpacity: 1
}
