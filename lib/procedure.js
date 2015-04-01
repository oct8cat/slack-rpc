'use strict';

var _ = require('lodash'),
    exec = require('child_process').exec

/**
 * Procedure
 *
 * @constructor
 * @alias SlackRPC.ProcedureStore.Procedure
 * @property {string} name
 * @property {string} wd
 * @property {string} cmd
 */
var Procedure = module.exports = function Procedure(options) {
    if (!_.isObject(options)) {
        throw new TypeError('`options` should be an object')
    }

    if (!_.isString(options.name)) {
        throw new TypeError('`options.name` should be a string')
    }
    this.name = options.name

    this.wd = _.isString(options.wd) && options.wd ? options.wd : process.cwd()

    if (!_.isString(options.cmd)) {
        throw new TypeError('`options.cmd` should be a string')
    }
    this.cmd = options.cmd

    this.slack = options.slack
}

/**
 * Executes the procedure passing `err`, `stdout`, `stderr` to the callback
 * after the process exits.
 *
 * >Aliases: `exec`
 * @param {function} cb
 */
Procedure.prototype.call = function (cb) {
    return exec(this.cmd, {cwd: this.wd}, cb)
}

Procedure.prototype.exec = Procedure.prototype.call
