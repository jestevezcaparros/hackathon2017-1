"use strict";
/**
 * Binding to Twitter's APIs
 * https://dev.twitter.com/docs
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor append a line here)
 */
import Twitter from 'twitter';
import WrapError from '../../lib_js/util_js/error';
import rx from 'rx-lite';


/**
 * Get Twitter client
 *
 * @returns {TwitterClient}
 * @throws {TwitterClientError}
 */
function getClient({
    consumer_key,
    consumer_secret,
    access_token_key,
    access_token_secret
} = {}) {

    try  {

        const client = new Twitter({
            consumer_key, 
            consumer_secret,
            access_token_key,
            access_token_secret
        });
        return client;

    } catch(e) {
        const error = WrapError(new Error(), {
            type: "TwitterClientError",
            cause: e,
            msg: "Could not get Twitter client" 
        });
        throw error;
    }
}

/**
 * Get Twitter stream - Streaming API 'statuses/filter'
 *
 * @returns {RxObservable}
 * @throws {TwitterStreamingError, TwitterClientError}
 */
function getStreamingStatusesFilter(
    client, 
    {track = 'twitter, javascript'} = {}
) {

    // Check the client is the correct type
    if (client.constructor !== Twitter) 
        throw WrapError(new Error(), {
            type: 'TwitterClientError',
            msg: "Invalid Twitter client as 1st parameter"
        });

    try {
        const observable = rx.Observable.create( observer => {
            
            const stream = client.stream(
                'statuses/filter', 
                {track}
            );
            stream.on('data', event =>  {
                observer.onNext(event);
                // TODO: Be aware that not only tweets arrive here as events
                // But other type of events (status deletion, etc)
                // See: https://dev.twitter.com/streaming/overview/messages-types
            });
 
            stream.on('error', error => {
                observer.onError(error);
            });
             
            return function dispose() {
                // Cleanup, if needed. Called when a subscription (observer) is disposed
                console.log('disposed');
            }
        });
        return observable;

    } catch(e) {
        const error = WrapError(new Error(), {
            type: "TwitterStreamingError",
            cause: e,
            msg: "Could not get Twitter stream" 
        });
        throw error;
    }
}

export default {
    getClient,
    getStreamingStatusesFilter
};
