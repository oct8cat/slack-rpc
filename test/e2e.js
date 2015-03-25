'use strict';

var supertest = require('supertest'),
    should = require('should'),
    fixtures = require('./fixtures')

describe('SlackRPC', function () {
    var agent
    before(function (done) {
        require('../bin/slack-rpc')(fixtures.procedures, function (err, server) {
            if (err) { done(err); return }
            agent = supertest(server)
            done()
        })
    })
    describe('GET /', function () {
        it('should not be allowed', function (done) {
            agent.get('/').expect(405, done)
        })
    })
    describe('POST /', function () {
        it('Should deny no-trigger-word requests', function (done) {
            agent.post('/').type('form').send(fixtures.requests[0]).expect(200, function (err, res) {
                if (err) { done(err); return }
                res.body.text.should.match('Wat?')
                done()
            })
        })
        it('Should deny unknown-trigger-word requests', function (done) {
            agent.post('/').type('form').send(fixtures.requests[1]).expect(200, function (err, res) {
                if (err) { done(err); return }
                res.body.text.should.match('Wat do with "wat do"?')
                done()
            })
        })
        it('Should execute valid requests', function (done) {
            agent.post('/').type('form').send(fixtures.requests[2]).expect(200, function (err, res) {
                if (err) { done(err); return }
                res.body.text.should.match(new RegExp(process.cwd()))
                done()
            })
        })
    })
})
