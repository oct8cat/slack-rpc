'use strict';

var http = require('http'),
    Qs = require('qs'),
    _ = require('lodash')

var Server = module.exports = function Server() {
    var server = http.createServer()

    server.on('request', function (req, res) {
        _.extend(res, {
            status: function (status) {
                this.writeHead(status)
                return this
            },
            answer: function (answer) {
                this.setHeader('Content-Type', 'application/json')
                this.write(JSON.stringify({text: answer}))
                this.end()
                return this
            }
        })

        if (req.method !== 'POST') { res.status(405).end(); return }

        var text = '',
            json
        req.on('data', function (chunk) {
            text += chunk
        })
        .on('end', function () {
            req.body = Qs.parse(text)
            server.emit('SRPC_POST', req, res)
        })
    })

    return server
}
