'use strict';

module.exports = {
    requests: [
        {
            trigger_word: 'test',
            text: 'test noop'
        },
        {
            trigger_word: 'test',
            text: 'test pwd'
        }
    ],
    procedures: [
        {name: 'pwd', cmd: 'pwd', slack: {
            host: 'http://localhost:3001',
            path: '/',
            channel: '#bot',
            username: 'bot'
        }}
    ]
}
