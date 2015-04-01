'use strict';

var http = require('http')

/**
 * Server constructor.
 * @constructor
 * @alias SlackRPC.Server
 */
var Server = module.exports = function Server() {
    return http.createServer()
}

/**
 * Messages dictionary.
 * @type object<string,string>
 */
Server.messages = {
    REQUEST: 'SRPC_REQUEST',
    REQUEST_ERROR: 'SRPC_REQUEST_ERROR',
    RESPONSE: 'SRPC_RESPONSE'
}

/**
 * ServerResponse prototype extension.
 * @constructor
 * @alias SlackRPC.Server.ResponseProto
 */
var ResponseProto = Server.ResponseProto = function ResponseProto() {}

/**
 * Writes the status to the response. Chainable.
 * @param {number} status
 */
ResponseProto.status = function (status) {
    this.writeHead(status)
    return this
}

/**
 * Responses with the given answer formatted to Slack outgoing webhook format.
 * Chainable.
 * @param {string} answer
 */
ResponseProto.answer = function (answer) {
    this.setHeader('Content-Type', 'application/json')
    this.write(JSON.stringify({text: answer}))
    this.end()
    return this
}
