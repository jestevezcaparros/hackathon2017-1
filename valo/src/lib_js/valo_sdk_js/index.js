"use strict";
/**
 * Valo JS sdk main index
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor append a line here)
 */
export * as streams from './api/streams';
export * as queries from './api/queries';
export {
    retryOnConflict
} from './util';
