#!/usr/bin/env node
'use strict';

var SlackRPC = require('..'),
    _ = require('lodash'),
    PORT = process.env.PORT || 3000

module.exports = function(procedures, cb) {
    if (_.isFunction(procedures)) { cb = procedures; procedures = [] }
    if (!_.isFunction(cb)) { cb = function(err) {} }

    _.each(procedures, SlackRPC.procedures.add, SlackRPC.procedures)

    var server = SlackRPC.Server()
    server.on('error', cb)
    server.on('SRPC_POST', function (req, res) {
        var procedure
        try {
            procedure = SlackRPC.procedures.get(req.body.trigger_word)
        } catch (err) {
            res.answer('Wat?')
            return
        }
        if (!procedure) {
            res.answer('Wat do with "' + req.body.trigger_word + '"?')
            return
        }
        procedure.call(function (err, stdout) {
            res.answer(err || stdout)
            res.end()
        })
    })
    server.listen(PORT, function () {
        cb(null, server)
    })
}

if (require.main === module) {
    var proceduresPath = process.argv[2]
    if (!proceduresPath) {
        console.log('Usage: slack-rpc-server.js /path/to/procedures')
        process.exit(0)
        return
    }

    var procedures
    try {
        procedures = require(proceduresPath)
    } catch (err) {
        console.error('Invalid procedures path')
        process.exit(1)
        return
    }

    if (!_.isArray(procedures)) {
        console.error('Procedures should be an array')
        process.exit(1)
        return
    }

    module.exports(function (err, server) {
        if (err) { console.error(err); process.exit(1); return }
        console.log('Now running on ' + PORT)
    })
}
