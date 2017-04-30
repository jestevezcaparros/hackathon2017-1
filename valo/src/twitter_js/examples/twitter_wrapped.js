"use strict";
/**
 * Connecting to Twitter - Example using twitter wrapper
 * 
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor append a line here)
 */
import twitter from '../lib/twitter';

///////////////////////////////////////////////////////////////////////////////
// Main
///////////////////////////////////////////////////////////////////////////////
function main() {

    try {

        //
        // Get Twitter client - Keys and tokens stored in env variables
        //
        const client = twitter.getClient({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });
    
    
        //
        // Subscribe to Twitter Streaming API - Returned as RX observable
        //
        const observable = twitter.getStreamingStatusesFilter(
            client,
            {track: "python, javascript, java, clojure"}
        );
        observable.subscribe(
            evt => {
                // Errors here should be handled, otherwise they go unnoticed
                console.log(evt && evt.text);
            },
            err => {
                console.log(">>>> Twitter Streaming Error", err);
            },
            () => {
                console.log(">>>> Twitter Stream Closed");
            }
        );

    } catch(e) {
        console.error("There be errors!");
        console.error(e); 
    }
}

///////////////////////////////////////////////////////////////////////////////
// Run!
///////////////////////////////////////////////////////////////////////////////
main();
