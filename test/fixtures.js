'use strict';

module.exports = {
    requests: [
        // No trigger word
        {
            token: 'XXXXXXXXXXXXXXXXXX',
        },
        // Not registered procedure
        {
            token: 'XXXXXXXXXXXXXXXXXX',
            trigger_word: 'wat do'
        },
        // Registered procedure
        {
            token: 'XXXXXXXXXXXXXXXXXX',
            trigger_word: 'show me cwd'
        },
    ],
    procedures: [
        {name: 'show me cwd', cmd: 'pwd'}
    ]
}
