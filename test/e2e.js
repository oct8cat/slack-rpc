'use strict';

var supertest = require('supertest'),
    should = require('should'),
    http = require('http'),
    Qs = require('qs'),
    fixtures = require('./fixtures')

var PORT = process.env.PORT || 3000

describe('SlackRPC', function () {
    var agent
    before(function (done) {
        require('../bin/slack-rpc')(PORT, fixtures.procedures, function (err, server) {
            if (err) { done(err); return }
            agent = supertest(server)
            done()
        })
    })
    describe('GET /', function () {
        it('should not be allowed', function (done) {
            agent.get('/').expect(200, function (err, res) {
                if (err) { done(err); return }
                res.body.text.should.match(/bad method/i)
                done()
            })
        })
    })
    describe('POST /', function () {
        it('should deny invalid content types', function (done) {
            agent.post('/').type('json').expect(200, function (err, res) {
                if (err) { done(err); return }
                res.body.text.should.match(/bad content type/i)
                done()
            })
        })
        it('should not execute unknown procedures', function (done) {
            agent.post('/').type('form').send(fixtures.requests[0]).expect(200, function (err, res) {
                res.body.text.should.match(/procedure not found/i)
                done()
            })
        })
        it('should execute valid procedures and call an incoming hook on complete', function (done) {
            var server = http.createServer()
            server.on('request', function (req, res) {
                var json, text = ''
                req.on('data', function (data) {
                    text += data
                }).on('end', function () {
                    json = JSON.parse(Qs.parse(text).payload)
                    json.text.should.match(new RegExp(process.cwd()))
                    done()
                })
            })
            server.listen(3001, function () {
                agent.post('/').type('form').send(fixtures.requests[1]).expect(200, function (err, res) {
                    if (err) { done(err); return }
                })
            })
        })
    })
})
