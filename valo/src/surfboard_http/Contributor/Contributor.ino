#include <SensorSample.h>
#include <Contributor.h>

using namespace io::valo::iot;

// Create contributor
Contributor con(Serial, "3452352345", "localhost", 8888);

// Create sensors
SensorSample temp("/streams/iot/team1/temperature", "temperature", "celsius");
SensorSample humidity("/streams/iot/team1/humidity", "humidity", "percentage");
SensorSample distance("/streams/iot/team1/distance", "distance", "meter");
SensorSample luminance("/streams/iot/team1/luminance", "luminance", "lumex");
SensorSample alcohol("/streams/iot/team1/alcohol", "alcohol", "vol");

void setup() {
  // Sets the serial port speed
  Serial.begin(115200);

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
