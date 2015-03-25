'use strict';

var _ = require('lodash'),
    exec = require('child_process').exec

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
}

Procedure.prototype.call = function (cb) {
    return exec(this.cmd, {cwd: this.wd}, cb)
}
