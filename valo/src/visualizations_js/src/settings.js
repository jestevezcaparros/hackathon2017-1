"use strict";
/**
 * Settings module
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author (Each contributor append a line here)
 */
export const DEBUG = false;
export const HOST = {valoHost: "localhost", valoPort: 8888};
export const ICON_URL = 'http://localhost:8080/icons/'
export const TENANT = 'demo';
// VALO QUERIES
export const QUERY_MOB_HAPPINESS = `
  from /streams/demo/mobile/happiness
  select timestamp, contributor.user.typeOfParticipant as typeOfParticipant, position, happiness
`;
export const HISTORICAL_QUERY_MOB_HAPPINESS = `
  from historical /streams/demo/mobile/happiness
  select timestamp, contributor.user.typeOfParticipant as typeOfParticipant, position, happiness
  order by timestamp
  take 10000
`;
export const QUERY_MOB_LOCATION = `
  from /streams/demo/mobile/location
  select timestamp, contributor.user.typeOfParticipant as typeOfParticipant, position
`;
export const HISTORICAL_QUERY_MOB_LOCATION = `
  from historical /streams/demo/mobile/location
  select timestamp, contributor.user.typeOfParticipant as typeOfParticipant, position
  order by timestamp
  take 10000
`;
export const QUERY_TEMP = `
  from /streams/demo/iot_board/temperature
  select timestamp, contributor, temperature, position
`;
export const HISTORICAL_QUERY_TEMP = `
  from historical /streams/demo/iot_board/temperature
  select timestamp, temperature, position
  take 10000
`;
export const QUERY_HAPPINESS_AVG = `
  from /streams/demo/mobile/happiness
  group by contributor.user.typeOfParticipant, timestamp window of 1 minute every 1 second
  select typeOfParticipant as TypeOfParticipant, 100 * avg( (happiness+1.0) / 2.0) as AverageHappiness
`;
export const HISTORICAL_QUERY_HAPPINESS_AVG = QUERY_HAPPINESS_AVG.replace('from ', 'from historical ');
export const QUERY_TWEETS = `
  from /streams/demo/twitter/tweets
  select tweet.text, tweet.user.name, tweet.user.screen_name, tweet.user.location, tweet.user.followers_count, tweet.user.profile_image_url_https, tweet.created_at
`;
export const HISTORICAL_QUERY_TWEETS = QUERY_TWEETS.replace('from ', 'from historical ');

// Emulates how many people is publishing data to Valo
export const MAP_CONTAINER_CSS_SELECTOR = '.map-container';
export const PEOPLE = 3;
// Use Record and Replay Version
// (to enable it, append the query search ?replay to the server url)
export const REPLAY = false;
export const REPLAY_INTERVAL = 50;
export const LA_TERMICA_COORDINATES = {
  lat: 36.689150,
  lon: -4.445000,
  radius: 80,
  bounds:{
    sw:{
      lat: 36.688845,
      lon: -4.445961
    },
    ne: {
      lat: 36.689417,
      lon: -4.443649
    }
  }
};
// export const ITRS_COORDINATES = {
//   lat: 36.734948
//   lon: -4.557490
//   radius: 80,
//   bounds:{
//     sw:{
//       lat: 36.734823
//       lon: -4.558412
//     },
//     ne: {
//       lat: 36.734634,
//       lon: -4.557071
//     }
//   }
// }
export const MAP_OPTIONS = {
    zoom: 20,
    disableDefaultUI: true,
    backgroundColor: "#bbb",
    scrollwheel: true,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    minZoom: 18,
    maxZoom: 20,
    center: LA_TERMICA_COORDINATES,
    styles: [
    {
        "elementType": "labels",
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
                "invert_lightness": true
            },
            {
                "saturation": -80
            },
            {
                "lightness": 30
            },
            {
                "gamma": 0.5
            },
            {
                "hue": "#3d433a"
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
    strokeColor: 'rgba(27, 217, 221, 0)',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: 'rgba(27, 217, 221, .3)',
    fillOpacity: 1
}

export const POLYGON_BATHROOM_STYLE = {
    strokeColor: '#343c30',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: '#343c30',
    fillOpacity: 1
}
