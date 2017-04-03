import mqtt from 'mqtt';

import config from '../../conf/config.js';
console.log(JSON.stringify(config, null, 4));

const client = mqtt.connect('mqtt://iot.eclipse.org');
const QUEUES = [
    '/jonthebeach/sensors/temperature',
    '/jonthebeach/sensors/humidity',
    '/jonthebeach/sensors/alcohol',
    '/jonthebeach/sensors/light',
    '/jonthebeach/sensors/distance'
];


client.on('connect', () => {
    console.log('connected');
    client.subscribe('presence');
    client.subscribe('/jonthebeach/sensors/temperature');
    // Subscribe to all the sensors' queues
    QUEUES.forEach( q => client.subscribe(q));
    setTimeout( () => client.publish('presence', "Hello"), 2000);
});
client.on('message', (topic, message) => {
    // Message is buffer
    console.log(topic, message.toString());
});
client.on('error', function() {
    console.error('ERROR');
});
