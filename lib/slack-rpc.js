'use strict';

/**
 * SlackRPC - API entry point.
 * @constructor
 */
var SlackRPC = module.exports = function SlackRPC() {
}

SlackRPC.ProcedureStore = require('./procedure-store')
SlackRPC.Server = require('./server')
SlackRPC.ErrorFactory = require('./error_factory')

/**
 * Shared [procedure storage]{@link SlackRPC.ProcedureStore} instance.
 * @type SlackRPC.ProcedureStore
 */
SlackRPC.procedures = new SlackRPC.ProcedureStore()
