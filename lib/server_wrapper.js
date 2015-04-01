'use strict';

var _ = require('lodash'),
    Qs = require('qs'),
    SlackRPC = require('..'),
    superagent = require('supertest').agent

var msgs = SlackRPC.Server.messages,
    createErr = SlackRPC.ErrorFactory.create

/**
 * Server wrapper.
 * Runs [server]{@link SlackRPC.Server} instance, handles its errors and events.
 * @constructor
 */
var ServerWrapper = module.exports = function ServerWrapper() {}

/**
 * Wraps [server]{@link SlackRPC.Server} instance.
 * @param {number} port
 * @param {Array<SlackRPC.ProcedureStore.Procedure>} procedures
 */
ServerWrapper.wrap = function (port, procedures, cb) {
    if (_.isFunction(procedures)) { cb = procedures; procedures = [] }
    if (!_.isFunction(cb)) { cb = function(err) {} }

    _.each(procedures, SlackRPC.procedures.add, SlackRPC.procedures)

    var server = SlackRPC.Server()

    server
    .on('error', cb)
    .on('request', ServerWrapper._onRequest.bind(server))
    .on(msgs.REQUEST_ERROR, ServerWrapper._onRpcRequestError.bind(server))
    .on(msgs.REQUEST, ServerWrapper._onRpcRequest.bind(server))
    .on(msgs.RESPONSE, ServerWrapper._onRpcResponse.bind(server))
    .listen(port, function () { cb(null, server) })
}


/**
 * Makes the server instance emit a new request error of the given type.
 * @param {SlackRPC.Server} server
 * @param {string} type
 * @param {object} options
 * @param {object} req
 * @param {object} res
 * @private
 */
var emitReqErr = ServerWrapper._emitRequestError = function (server, type, options, req, res) {
    server.emit(msgs.REQUEST_ERROR, createErr(type, options), req, res)
    return ServerWrapper
}

/**
 * Server's `request` event handler.
 * @param {object} req
 * @param {object} res
 * @private
 */
ServerWrapper._onRequest = function (req, res) {
    var that = this

    _.extend(res, SlackRPC.Server.ResponseProto)

    // Deny invalid methods
    var m = req.method
    if (m !== 'POST') {
        emitReqErr(that, 'ServerBadMethod', {method: m}, req, res)
        return
    }
    // Deny invalid content types
    var ct = req.headers['content-type']
    if (ct !== 'application/x-www-form-urlencoded') {
        emitReqErr(that, 'ServerBadContentType', {contentType: ct}, req, res)
        return
    }

    var text = ''
    req.on('data', function (chunk) {
        text += chunk
    })
    .on('end', function () {
        req.body = Qs.parse(text)
        that.emit(msgs.REQUEST, req, res)
    })
}

ServerWrapper._onRpcRequestError = function (err, req, res) {
    var text
    switch (err.constructor.name) {
        case 'ServerBadContentTypeError': text = 'Bad content type: ' + err.contentType; break
        case 'ServerBadMethodError': text = 'Bad method: ' + err.method; break
        case 'ProcedureNotFoundError': text = 'Procedure not found: ' + err.name; break
        default: text = 'Unknown error'; break
    }
    res.answer(text).end()
}

ServerWrapper._onRpcRequest = function (req, res) {
    var that = this,
        text = req.body.text || '',
        trigger = req.body.trigger_word || '',
        name = text.replace(new RegExp('^' + trigger + '\\s*'), ''),
        procedure = SlackRPC.procedures.get(name)

    if (!procedure) {
        ServerWrapper._emitRequestError(that, 'ProcedureNotFound', {name: name}, req, res)
        return
    }

    procedure.call(function (err, stdout) {
        that.emit(msgs.RESPONSE, procedure, err || stdout)
    })
    res.answer('On my way!').end()
}

ServerWrapper._onRpcResponse = function (procedure, data) {
    if (!procedure.slack) { return }
    var host = procedure.slack.host || 'https://hooks.slack.com',
        path = procedure.slack.path,
        json = {
            channel: procedure.slack.channel || '#slack-rpc',
            username: procedure.slack.username || 'slack-rpc',
            text: '```\n' + data + '```',
        }
    require('supertest').agent(host).post(path).type('form').send({payload: JSON.stringify(json)}).end(function (err, res) {
        if (err) { console.error(err) }
    })
}
