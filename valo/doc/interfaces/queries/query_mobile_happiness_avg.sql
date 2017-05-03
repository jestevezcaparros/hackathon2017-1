from /streams/demo/mobile/happiness
group by contributor.user.typeOfParticipant
select typeOfParticipant as TypeOfParticipant, avg( (happiness+1.0) / 2.0) as AverageHappiness
-- AverageHappiness shouyd be in interval [0.0, 1.0]
