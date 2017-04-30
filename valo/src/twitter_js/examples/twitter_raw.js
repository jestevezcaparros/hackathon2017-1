"use strict";
/**
 * Connecting to Twitter - Example using raw twitter library
 * https://www.npmjs.com/package/twitter
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor append a line here)
 */
import Twitter from 'twitter';


///////////////////////////////////////////////////////////////////////////////
// Main
///////////////////////////////////////////////////////////////////////////////
function main() {

    try {
        //
        // Get Twitter client - Keys and tokens stored in env variables
        //
        const client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });

        //
        // Call Twitter REST API
        //
        client.get('users/lookup', {screen_name : "dofideas"},  (error, data, response) => {
            if (error) throw error;
            console.log(data);
        });

        //
        // Subscribe to Twitter Streaming API
        //
        const stream = client.stream('statuses/filter', {track: 'javascript, python, java, clojure'});
        stream.on('data', event =>  {
            console.log(event && event.text);
        });
 
        stream.on('error', error => {
            throw error;
        });

    } catch(e) {
        console.error("There be errors!");
        console.error(e); 
    }
}

///////////////////////////////////////////////////////////////////////////////
// Run!
///////////////////////////////////////////////////////////////////////////////
main();
