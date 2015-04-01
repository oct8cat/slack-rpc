'use strict';

var _ = require('lodash'),
    util = require('util')

/**
 * Error factory.
 *
 * @constructor
 * @alias SlackRPC.ErrorFactory
 */
var ErrorFactory = module.exports = function ErrorFactory() {}

/**
 * Creates a new instance of an error of the given type.
 *
 * @param {string} type Error type name.
 * @param {string} [message]
 * @param {object} [options]
 */
ErrorFactory.create = function(type, message, options) {
    if (_.isObject(message)) { options = message; message = '' }
    if (_.isUndefined(options)) { options = {} }

    var Ctor = ErrorFactory[type + 'Error'],
        err = new Ctor(message)

    _.each(_.keys(options), function (k) {
        err[k] = options[k]
    })

    return err
}

/**
 * Base error.
 *
 * @constructor
 * @alias SlackRPC.ErrorFactory.BaseError
 */
ErrorFactory.BaseError = function () {
    Error.apply(this, arguments)
    this.name = 'BaseError'
}
util.inherits(ErrorFactory.BaseError, Error)

/**
 * Bad request content type error.
 *
 * @constructor
 * @alias SlackRPC.ErrorFactory.ServerBadContentTypeError
 * @property {string} contentType
 */
ErrorFactory.ServerBadContentTypeError = function ServerBadContentTypeError () {
    ErrorFactory.BaseError.apply(this, arguments)
    this.name = 'ServerBadContentTypeError'
}
util.inherits(ErrorFactory.ServerBadContentTypeError, ErrorFactory.BaseError)

/**
 * Bad request method error.
 *
 * @constructor
 * @alias SlackRPC.ErrorFactory.ServerBadMethodError
 * @property {string} method
 */
ErrorFactory.ServerBadMethodError = function ServerBadMethodError () {
    ErrorFactory.BaseError.apply(this, arguments)
    this.name = 'ServerBadMethodError'
}
util.inherits(ErrorFactory.ServerBadMethodError, ErrorFactory.BaseError)

/**
 * Procedure not found error.
 *
 * @constructor
 * @alias SlackRPC.ErrorFactory.ProcedureNotFoundError
 * @property {string} name
 */
ErrorFactory.ProcedureNotFoundError = function ProcedureNotFoundError () {
    ErrorFactory.BaseError.apply(this, arguments)
    this.name = 'ProcedureNotFoundError'
}
util.inherits(ErrorFactory.ProcedureNotFoundError, ErrorFactory.BaseError)
