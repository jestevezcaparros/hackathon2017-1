--
from /streams/demo/mobile/happiness
group by contributor.user.typeOfParticipant
select typeOfParticipant, avg(happiness) as avgHappiness, last(contributor.user.name) as lastParticipantWhoRatedJOTB, count() as N

-- 
from /streams/demo/mobile/happiness
group by contributor.user.typeOfParticipant, timestamp window of 24 hour every 10 seconds
select typeOfParticipant, timestamp, count() as NumberOfRatings, toDouble(count()) / 24.0 as AvgNumberOfRatingsPerHour

-- AVERAGE POSITION PER TYPE OF PARTICIPANT
from historical /streams/demo/mobile/location
select position.longitude, position.latitude, contributor.user.typeOfParticipant
group by typeOfParticipant
select typeOfParticipant, avg(longitude) as Long, avg(latitude) as Lat
