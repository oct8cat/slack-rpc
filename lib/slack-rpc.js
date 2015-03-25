'use strict';

var SlackRPC = module.exports = function SlackRPC() {
}

SlackRPC.ProcedureStore = require('./procedure-store')

SlackRPC.procedures = new SlackRPC.ProcedureStore()

SlackRPC.Server = require('./server')
