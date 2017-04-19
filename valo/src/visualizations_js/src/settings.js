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
