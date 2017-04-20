"use strict";
/**
 * Settings module
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

export const HOST = {valoHost: "localhost", valoPort: 8888};
export const TENANT = 'demo';
export const QUERY = 'from /streams/demo/jotb/attenders';
export const QUERY_POSITION = 'from /streams/demo/jotb/position';
export const ICON_URL = 'http://localhost:8080/'
//export const LA_TERMICA_COORDINATES = {
//     lat: 36.7347359,
//     lon: -4.557628
// };
export const LA_TERMICA_COORDINATES = {
    lat: 36.689150,
    lon: -4.445000
};
export const MAP_OPTIONS = {
    zoom: 20,
    disableDefaultUI: true,
    backgroundColor: "#bbb",
    styles: [
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -80,
                    "hue": "#bbb",
                    "gamma": 0.8
                }
            ]
        }
  ]
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
    strokeColor: '#1BD9DD',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: '#1BD9DD',
    fillOpacity: 1
}

export const POLYGON_BATHROOM_STYLE = {
    strokeColor: '#009933',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: '#009933',
    fillOpacity: 1
}
