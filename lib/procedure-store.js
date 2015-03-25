'use strict';

var _ = require('lodash')

var ProcedureStore = module.exports = function ProcedureStore() {
    this._procedures = []
}

var Procedure = ProcedureStore.Procedure = require('./procedure')

ProcedureStore.prototype.add = function (procedure) {
    if (!_.isObject(procedure)) {
        throw new TypeError('`procedure` should be an object')
    }
    if (!(procedure instanceof Procedure)) { procedure = new Procedure(procedure) }

    this._procedures.push(procedure)
    return this
}

ProcedureStore.prototype.get = function (name) {
    if (!_.isString(name)) {
        throw new TypeError('`name` should be a string')
    }
    return _.find(this._procedures, {name: name})
}
