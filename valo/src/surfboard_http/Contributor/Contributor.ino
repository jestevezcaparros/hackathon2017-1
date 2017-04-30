
// Arduino dependencies
#include <SPI.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <Time.h>

// Internal dependencies
#include <SensorSample.h>
#include <Contributor.h>
using namespace io::valo::iot;

// Globals
char ssid[] = "myWifiSSID";      //  your network SSID (name)
char pass[] = "myWifiPasswd";   // your network password
int status = WL_IDLE_STATUS;
char CONTRIBUTOR_ID[] = "board-00001";
char VALO_HOST[] = "192.168.1.35";
int  VALO_PORT = 8888;
char LATITUDE[] = "36.7585406465564";
char LONGITUDE[] = "-4.3971722687";

// Initialize the Wifi client library
//WiFiClient client;

// Contributor
//Contributor<Print> con(client, "3452352345", "localhost", 8888);
Contributor<Print> con(Serial, CONTRIBUTOR_ID, VALO_HOST, VALO_PORT);

// Sensors
SensorSample temp("/streams/demo/iot_board/temperature", "temperature", "celsius");
SensorSample humidity("/streams/demo/iot_board/humidity", "humidity", "percentage");
SensorSample distance("/streams/demo/iot_board/distance", "distance", "meter");
SensorSample luminance("/streams/demo/iot_board/luminance", "luminance", "lumex");
SensorSample alcohol("/streams/demo/iot_board/alcohol", "alcohol", "vol");

/**
 * Sets the Wifi
 */
void setupWifi() {
  // check for the presence of the shield:
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    // don't continue:
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if ( fv != "1.1.0" )
    Serial.println("Please upgrade the firmware");

  // attempt to connect to Wifi network:
  while ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(10000);
  }
}

void setup() {
  // Sets the serial port speed
  Serial.begin(115200);

  // Sets the wifi
  //setupWifi();

  // Set the sensor static data
  temp.setPosition(LATITUDE, LONGITUDE);
  humidity.setPosition(LATITUDE, LONGITUDE);
  distance.setPosition(LATITUDE, LONGITUDE);
  luminance.setPosition(LATITUDE, LONGITUDE);
  alcohol.setPosition(LATITUDE, LONGITUDE);
}

// Test some values for every sensor on the main loop
void loop() {

  temp.setValue("30");
  con.feed(temp);

  humidity.setValue("40");
  con.feed(humidity);

  distance.setValue("456");
  con.feed(distance);

  luminance.setValue("2.0");
  con.feed(luminance);

  alcohol.setValue("0.02");
  con.feed(alcohol);
  
  delay(10000);
}
