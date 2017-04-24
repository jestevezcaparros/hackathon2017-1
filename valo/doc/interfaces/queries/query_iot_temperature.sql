from '/streams/demo/iot_board/temperature'
group by contributor, timestamp window of 1 minute every 1 second
select contributor, timestamp, avg(temperature) as Temperature, 
last(position.latitude) as lat, last(position.longitude) as long
