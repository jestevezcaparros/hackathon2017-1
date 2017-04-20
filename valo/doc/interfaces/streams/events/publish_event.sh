# Publish an event into a Valo Stream
curl http://localhost:8888/streams/demo/mobile/happiness -X POST --data @./evt_mob_happiness_00001.json -H "Content-Type: application/json"
