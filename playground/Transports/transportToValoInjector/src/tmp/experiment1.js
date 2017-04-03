var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://iot.eclipse.org');

var QUEUES = [
    '/jonthebeach/sensors/temperature',
    '/jonthebeach/sensors/humidity',
    '/jonthebeach/sensors/alcohol',
    '/jonthebeach/sensors/light',
    '/jonthebeach/sensors/distance'
];


client.on('connect', function() {
    console.log('connected');
    client.subscribe('presence');
    client.subscribe('/jonthebeach/sensors/temperature');
    QUEUES.forEach( function(q) {
        client.subscribe(q);         
    });
    setTimeout( function() {
        client.publish('presence', "Hello");
    }, 2000);
});
client.on('message', function(topic, message) {
    // Message is buffer
    console.log(topic, message.toString());
});
client.on('error', function() {
    console.error('ERROR');
});
