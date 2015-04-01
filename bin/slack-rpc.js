#!/usr/bin/env node
'use strict';

var ServerWrapper = require('../lib/server_wrapper'),
    _ = require('lodash')

var PORT = process.env.PORT || 3000

module.exports = ServerWrapper.wrap

if (require.main === module) {
    var exit = function (err) {
            if (err) { console.error(err) }
            process.exit(err ? 1 : 0)
        },
        usage = function () {
            console.log('Usage: slack-rpc-server.js /path/to/procedures')
        }

    var proceduresPath = process.argv[2]
    if (!proceduresPath) { usage(); exit(); return }

    var procedures
    try {
        procedures = require(proceduresPath)
    } catch (err) { exit('Invalid procedures path'); return }

    if (!_.isArray(procedures)) { exit('Procedures should be an array'); return }

    module.exports(PORT, procedures, function (err, server) {
        if (err) { exit(err); return }
        console.log('Now running on ' + PORT)
    })
}
