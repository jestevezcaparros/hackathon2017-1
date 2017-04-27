/**
 * This file declares the Sample class implementation for the sensor stream schema used in JOTB Hackathon.
 *
 * @license MIT
 * @author David Torelli Rosendo <dtorelli@itrsgroup.com>
 */

// External dependencies
#include <stdio.h>

#ifndef IO_VALO_IOT_SENSOR_SAMPLE_H
#define IO_VALO_IOT_SENSOR_SAMPLE_H

namespace io {
namespace valo {
namespace iot {

static char g_date_time[] = "2017-04-20T10:52:28.638Z";

/**
 * This class represents a sample of the stream content for the IoT demonstration.
 * It encapsulates the construction of the sample payload for a given sensor.
 *
 * @code
 * SensorSample temp("/streams/iot/team1/temperature", "temperature", "celsius");
 * temp.setPosition("36.7585406465564", "-4.3971722687");
 * temp.setValue("30");
 * @endcode
 */
class SensorSample {

  // ---------------------------------------------------------------------------------------------------------------------
  // Public methods
  // ---------------------------------------------------------------------------------------------------------------------
 public:

  /**
   * Constructor.
   *
   * @param meas The measurement value (e.g. temperature).
   * @param unit The unit of the measurement.
   */
  SensorSample(const char *stream, const char *meas, const char *unit) : stream_(stream), meas_(meas), unit_(unit) {};

  /**
   * Destructor.
   */
  virtual ~SensorSample() {}

  /**
   * Sets the GPS position of the IoT device.
   *
   * @param lon GPS longitude.
   * @param lat GPS latitude.
   */
  inline void setPosition(const char *lon, const char *lat) {
    lon_ = lon;
    lat_ = lat;
  }

  /**
   * Sets the value for the sensor.
   * @param value
   */
  inline void setValue(const char *value) { value_ = value; }

  /**
   * Serialise the sample into a string for a given contributor identifier.
   *
   * @param id the contributor identifier.
   * @param output the output string containing the serialised data.
   * @return the length of the serialised string.
   */
  inline int toString(const char *id, char *output) {
    refresh_date_time();
    sprintf(output, "{\"contributor\":\"%s\", \"position\":{\"latitude\":%s,\"longitude\":%s},"
        "\"timestamp\":\"%s\",\"%s\":%s,\"units\":\"%s\"}", id, lon_, lat_, g_date_time, meas_, value_, unit_);
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // Protected methods
  // ---------------------------------------------------------------------------------------------------------------------
 protected:
  inline void refresh_date_time() {
    // TODO: Call Time API to get the time stamp and set it into global g_date_time
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // Public attributes
  // ---------------------------------------------------------------------------------------------------------------------
 public:
  const char *stream_;

  // ---------------------------------------------------------------------------------------------------------------------
  // Protected attributes
  // ---------------------------------------------------------------------------------------------------------------------
 protected:
  const char *lon_;
  const char *lat_;
  const char *meas_;
  const char *unit_;
  const char *value_;
};

} // iot
} // valo
} // io

#endif // IO_VALO_IOT_SENSOR_SAMPLE_H
