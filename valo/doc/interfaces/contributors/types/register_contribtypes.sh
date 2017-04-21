###########################################
# Register contributor type - 1st time
###########################################
curl http://localhost:8888/contributors/demo/iot_board -X PUT --data @contribtype_iot_board.json -H "Content-Type: application/json"

###########################################
# Update contributor type
###########################################
# Get current Valo-Config-Version
curl http://localhost:8888/contributors/demo/iot_board -v 2>&1 | grep "Valo-Config-Version:"
# Update contributor with the retrieved Valo-Config-Version
curl http://localhost:8888/contributors/demo/iot_board -X PUT --data @contribtype_iot_board.json -H "Content-Type: application/json" -H "Valo-Config-Version: AWyYBZCIt6Kw4yi31lWy0ymgAKMtWxWDMK4IErZ65eYzAAAAAAAAAAI="
