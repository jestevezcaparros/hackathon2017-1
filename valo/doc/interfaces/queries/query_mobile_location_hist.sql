from historical /streams/demo/mobile/location
group by contributor, timestamp window of 1 minute every 1 minute
select contributor, timestamp, last(position.latitude) as lat, last(position.longitude) as long
