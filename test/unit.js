'use strict';

var should = require('should'),
    _ = require('lodash'),
    os = require('os')

describe('SlackRPC', function () {
    var SlackRPC
    before(function () {
        SlackRPC = require('..')
    })
    describe('.procedures', function () {
        it('should be an instance of `SlackRPC.ProcedureStore`', function () {
            SlackRPC.procedures.should.be.instanceOf(SlackRPC.ProcedureStore)
        })
    })
    describe('.ProcedureStore', function () {
        describe('#add()', function () {
            var procedures
            beforeEach(function () {
                procedures = new SlackRPC.ProcedureStore()
            })
            it('should deny invalid procedures', function () {
                should.throws(function () {
                    procedures.add()
                }, '`procedure` should be an object')
            })
            it('should add a valid procedure', function () {
                var o = {name: 'proc1', cmd: 'pwd'},
                    p = _.find(procedures.add(o)._procedures, {name: o.name})
                p.should.be.instanceOf(SlackRPC.ProcedureStore.Procedure)
                p.should.match(o)
            })
        })
        describe('#get()', function () {
            var procedures
            beforeEach(function () {
                procedures = new SlackRPC.ProcedureStore()
            })
            it('should retrieve `add`ed procedures', function () {
                var o = {name: 'proc1', cmd: 'pwd'}
                should.not.exist(procedures.get(o.name))
                procedures.add(o)
                var p = procedures.get(o.name)
                p.should.be.instanceOf(SlackRPC.ProcedureStore.Procedure)
                p.should.match(o)
            })
        })
        describe('.Procedure', function () {
            var Procedure
            beforeEach(function () {
                Procedure = SlackRPC.ProcedureStore.Procedure
            })
            it('should deny invalid options', function () {
                should.throws(function () {
                    var p = new Procedure()
                }, '`options` should be an object')
                should.throws(function () {
                    var p = new Procedure({})
                }, '`options.name` should be a string')
                should.throws(function () {
                    var p = new Procedure({name: 'proc1'})
                }, '`options.cmd` should be a string')
            })
            it('should allow valid options', function () {
                var o = {name: 'proc1', wd: os.tmpDir(), cmd: 'pwd'},
                    p = new Procedure(o)
                p.should.match(o)
            })
            it('should set `wd` to `process.cwd()` if not specified', function () {
                var o = {name: 'proc1', cmd: 'pwd'},
                    p = new Procedure(o)
                p.wd.should.be.equal(process.cwd())
            })
            describe('#call()', function () {
                it('should return `ChildProcess` instance', function () {
                    var o = {name: 'proc1', cmd: 'pwd'},
                        p = new Procedure(o),
                        c = p.call()
                    c.constructor.name.should.be.equal('ChildProcess')
                })
                it('should pass `err` and `stdout` to a callback', function (done) {
                    var o = {name: 'proc1', cmd: 'pwd'},
                        p = new Procedure(o)
                    p.call(function (err, stdout) {
                        should.not.exist(err)
                        stdout.should.match(new RegExp(p.wd))
                        done()
                    })
                })
            })
        })
    })
})
