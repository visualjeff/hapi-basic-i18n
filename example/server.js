'use strict';

const Hapi = require('hapi');
const Path = require('path');

const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 3000
});

server.register([{
    register: require('../'),
    options: {
        locale_path: Path.join(__dirname, 'locales'),
        cookie_name: 'language',
        default_language: 'EN',
        available_languages: ['EN', 'FR']
    }
}, {
    register: require('./routes/applicationRoutes')
}], (err) => {

    if (err) {
        throw err;
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }

    console.dir('Server running at: ' + server.info.uri, {
        colors: true
    });
});
