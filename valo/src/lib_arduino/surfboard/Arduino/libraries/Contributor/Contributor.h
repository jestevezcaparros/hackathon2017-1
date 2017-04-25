
/**
 * @file Contributor.h
 *
 * This file declares the Contributor class implementation
 *
 * ITRS Group all rights reserved (c) 2017.
 */

#ifndef IO_VALO_IOT_CONTRIBUTOR_H
#define IO_VALO_IOT_CONTRIBUTOR_H

// Arduino dependencies because of Print interface
#if ARDUINO >= 100
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

namespace io {
    namespace valo {
        namespace iot {
            
            /**
             * This class represents a contributor inside Valo system.
             * The user will configure it to point to a specific Valo host and port and will set the stream templates to send
             * data.
             *
             * @code
             * // One stream with temperature and humidity
             * Contributor con("3645634565", "localhost", 8888);
             * con.feed("/streams/iot/team1/temp_humidity", "{\"temp\":%d, \"humidity\":%d}", 30, 40);
             *
             * // One stream with temperature and another with humidity
             * con.feed("/streams/iot/team1/temp", "{\"temp\":%d}", 30);
             * con.feed("/streams/iot/team1/humidity", "{\"humidity\":%d}", 40);
             * @endcode
             */
            class Contributor {
                
                // ---------------------------------------------------------------------------------------------------------------------
                // Public methods
                // ---------------------------------------------------------------------------------------------------------------------
            public:
                
                /**
                 * Constructor.
                 *
                 * @param p the printer used to send the information (e.g. Serial)
                 * @param id the unique identifier of this contributor.
                 * @param host the host where this contributor is pointing to.
                 * @param port the port in the host where this contributor is pointing to.
                 */
                Contributor(const Print &p, const char *id, const char *host, int port);
                
                /**
                 * Destructor.
                 */
                virtual ~Contributor();
                
                /**
                 * Feeds the stream with a given sample of data.
                 *
                 * @param uri the uri of the target stream where data will be feed.
                 * @param sch stream format without considering the contributor schema.
                 * @param ... Variable arguments ...
                 */
                void feed(const char *uri, const char *sch, ...);
                
                /**
                 * Sends the sample information through the stream.
                 *
                 * @param uri the uri of the target stream where data will be feed.
                 * @param sample the sample of data to be sent to the stream.
                 */
                void feed(const SensorSample& sample);
                
                /**
                 * Feeds the stream with a given sample of data.
                 *
                 * @param uri the uri of the target stream where data will be feed.
                 * @param data data to send to the stream.
                 */
                void send(const char *uri, const char *data, int length);
                
                // ---------------------------------------------------------------------------------------------------------------------
                // Public attributes
                // ---------------------------------------------------------------------------------------------------------------------
            public:
                const Print &p_;
                const char *id_;
                
                // ---------------------------------------------------------------------------------------------------------------------
                // Protected attributes
                // ---------------------------------------------------------------------------------------------------------------------
            protected:
                const char *host_;
                int port_;
            };
            
        } // iot
    } // valo
} // io

#endif // IO_VALO_CONTRIBUTOR_H
