#
# Create tenant
#
curl http://localhost:8888/cluster/tenants/demo -X PUT --data "{}" -H "Content-Type: application/json"

#
# Create contributor types
#
curl http://localhost:8888/contributors/demo/iot_board -X PUT --data @./contributors/types/contribtype_iot_board.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/mobile_user -X PUT --data @./contributors/types/contribtype_mobile_user.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/realsense -X PUT --data @./contributors/types/contribtype_realsense.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/twitter_app -X PUT --data @./contributors/types/contribtype_twitter_app.json -H "Content-Type: application/json"

#
# Register contributor instances
#
curl http://localhost:8888/contributors/demo/iot_board/instances/surfboard205 -X PUT --data @./contributors/instances/instance_iot_surfboard205.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/iot_board/instances/board-00001 -X PUT --data @./contributors/instances/instance_iot_board_01.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/iot_board/instances/board-00002 -X PUT --data @./contributors/instances/instance_iot_board_02.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/mobile_user/instances/mobile-user-00001 -X PUT --data @./contributors/instances/instance_mobile_user_01.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/mobile_user/instances/mobile-user-00002 -X PUT --data @./contributors/instances/instance_mobile_user_02.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/realsense/instances/realsense-00001 -X PUT --data @./contributors/instances/instance_realsense_01.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/realsense/instances/realsense-00002 -X PUT --data @./contributors/instances/instance_realsense_02.json -H "Content-Type: application/json"
curl http://localhost:8888/contributors/demo/twitter_app/instances/twitter-app-00001 -X PUT --data @./contributors/instances/instance_twitter_app_01.json -H "Content-Type: application/json"

#
# Create & persist streams
#
curl http://localhost:8888/streams/demo/mobile/happiness -X PUT --data @./streams/schemas/stream_mob_happiness.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/mobile/happiness/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/mobile/location -X PUT --data @./streams/schemas/stream_mob_location.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/mobile/location/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/iot_board/alcohol -X PUT --data @./streams/schemas/stream_iot_alcohol.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/iot_board/alcohol/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/iot_board/humidity -X PUT --data @./streams/schemas/stream_iot_humidity.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/iot_board/humidity/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/iot_board/luminance -X PUT --data @./streams/schemas/stream_iot_luminance.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/iot_board/luminance/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/iot_board/temperature -X PUT --data @./streams/schemas/stream_iot_temperature.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/iot_board/temperature/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/iot_board/distance -X PUT --data @./streams/schemas/stream_iot_distance.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/iot_board/distance/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"

curl http://localhost:8888/streams/demo/twitter/tweets -X PUT --data @./streams/schemas/stream_tweet.json -H "Content-Type: application/json"
curl http://localhost:8888/streams/demo/twitter/tweets/repository -X PUT --data  @./streams/schemas/repo_ssr.json -H "Content-Type: application/json"
