"use strict";
/**
 * Valo JS sdk main index
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor append a line here)
 */
export {
    createStream,
    setStreamRepository,
    publishEventToStream
} from './api/streams';
export {
    runSingleQuery
} from './api/queries';

export {
    retryOnConflict
} from './util';
