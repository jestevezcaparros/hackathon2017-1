from /streams/demo/mobile/happiness
group by contributor.user.typeOfParticipant, timestamp window of 1 minute every 1 second
select typeOfParticipant as TypeOfParticipant, 100 * avg( (happiness+1.0) / 2.0) as AverageHappiness
-- AverageHappiness shouyd be in interval [0.0, 1.0]
