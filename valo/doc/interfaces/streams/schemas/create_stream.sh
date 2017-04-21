###########################################
# Create stream - 1st time
###########################################
curl http://localhost:8888/streams/demo/mobile/happiness -X PUT --data @stream_mob_happiness.json -H "Content-Type: application/json"

###########################################
# Updtate stream
###########################################
# Get current Valo-Config-Version for the stream
curl http://localhost:8888/streams/demo/mobile/happiness -v 2>&1 | grep "Valo-Config-Version:"
# Update stream definition with the retrieved Valo-Config-Version
curl http://localhost:8888/streams/demo/mobile/happiness -X PUT --data @stream_mob_happiness.json -H "Content-Type: application/json" -H "Valo-Config-Version: AWyYBZCIt6Kw4yi31lWy0ymgAKMtWxWDMK4IErZ65eYzAAAAAAAAAAE="

###########################################
# Persist a stream in Time-Series (TSR) or Semi-Structured (SSR) repository
###########################################
curl http://localhost:8888/streams/demo/mobile/happiness/repository -X PUT --data  @repo_tsr.json -H "Content-Type: application/json"
