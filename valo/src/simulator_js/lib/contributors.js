"use strict";
/**
 * Contributor related functions
 *
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author (Each contributor appends a line here)
 */
import WrapError from '../../lib_js/util_js/error';
import {
    createContributorType,
    registerContributorInstance,
    retryOnConflict
} from '../../lib_js/valo_sdk_js/index';


/**
 * Creates contributor types
 *
 * @returns null
 * @throws {CreateContributorTypeError}
 * @params {Object} - Of contributorTypes as in config file 
 */
export async function createContributorTypes( valoClient, contributorTypes ) {

    try {
        const {
            host,
            port,
            tenant 
        } = valoClient;
        const values = Object.values(contributorTypes);

        // For each entry in contributorTypes, createp parallel request to Valo
        const promises = values.map(
            async contribTypeData => {
                const {
                    name,
                    schema
                } = contribTypeData;
                await retryOnConflict(createContributorType)(
                    { valoHost: host, valoPort: port },
                    [tenant, name],
                    {schema}
                );
            }
        );
        // Wait for all requests
        await Promise.all(promises);

    } catch(e) {
        throw WrapError(new Error, {
            type: "CreateContributorTypeError",
            cause: e
        });        
    }
}

/**
 * Registers contributors
 *
 * @returns null
 * @throws {RegisterContributorError}
 * @params {Object} - Of contributors as in config file 
 */
export async function registerContributors( valoClient, contributors ) {

    try {
        const {
            host,
            port,
            tenant 
        } = valoClient;

        // For each entry in contributors, createp parallel request to Valo
        const promises = contributors.map(
            async contribData => {
                const {
                    id,
                    contributorType,
                    valoData
                } = contribData;
                await retryOnConflict(registerContributorInstance)(
                    { valoHost: host, valoPort: port },
                    [tenant, contributorType, id],
                    valoData
                );
            }
        );
        // Wait for all requests
        await Promise.all(promises);

    } catch(e) {
        throw WrapError(new Error, {
            type: "RegisterContributorError",
            cause: e
        });        
    }
}
