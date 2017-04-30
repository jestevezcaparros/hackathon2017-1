
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
char ssid[] = "yourNetwork";      //  your network SSID (name)
char pass[] = "secretPassword";   // your network password
int status = WL_IDLE_STATUS;

// Initialize the Wifi client library
//WiFiClient client;

// Contributor
//Contributor<Print> con(client, "3452352345", "localhost", 8888);
Contributor<Print> con(Serial, "3452352345", "localhost", 8888);

// Sensors
SensorSample temp("/streams/iot/team1/temperature", "temperature", "celsius");
SensorSample humidity("/streams/iot/team1/humidity", "humidity", "percentage");
SensorSample distance("/streams/iot/team1/distance", "distance", "meter");
SensorSample luminance("/streams/iot/team1/luminance", "luminance", "lumex");
SensorSample alcohol("/streams/iot/team1/alcohol", "alcohol", "vol");

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
  temp.setPosition("36.7585406465564", "-4.3971722687");
  humidity.setPosition("36.7585406465564", "-4.3971722687");
  distance.setPosition("36.7585406465564", "-4.3971722687");
  luminance.setPosition("36.7585406465564", "-4.3971722687");
  alcohol.setPosition("36.7585406465564", "-4.3971722687");
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
