'use strict';

var _ = require('lodash')

/**
 * Procedures storage.
 * @constructor
 * @alias SlackRPC.ProcedureStore
 */
var ProcedureStore = module.exports = function ProcedureStore() {

    /**
     * [Added]{@link SlackRPC.ProcedureStore#add} procedures array.
     * @alias SlackRPC.ProcedureStore#_procedures
     * @type Array<SlackRPC.ProcedureStore.Procedure>
     * @private
     */
    this._procedures = []
}

/**
 * {@link ProcedureStore.Procedure} reference
 * @type function
 */
ProcedureStore.Procedure = require('./procedure')

/**
 * Adds a new procedure to the storage.
 * @param {SlackRPC.ProcedureStore.Procedure|object} procedure
 */
ProcedureStore.prototype.add = function (procedure) {
    if (!_.isObject(procedure)) {
        throw new TypeError('`procedure` should be an object')
    }
    if (!(procedure instanceof ProcedureStore.Procedure)) {
        procedure = new ProcedureStore.Procedure(procedure)
    }

    this._procedures.push(procedure)
    return this
}

/**
 * Retrieves [added]{@link SlackRPC.ProcedureStore#add} procedure by name.
 * @param {string} name
 */
ProcedureStore.prototype.get = function (name) {
    return _.find(this._procedures, {name: name})
}
