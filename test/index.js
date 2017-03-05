'use strict';

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Path = require('path');

// Declare internals
const internals = {};

// Test shortcuts
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('Hapi Basic i18n', () => {

    it('missing locale files', (done) => {

        const server = new Hapi.Server();
        server.connection();

        server.register({
            register: require('../'),
            options: {
                locale_path: Path.join(__dirname, 'local'),
                default_language: 'EN',
                available_languages: ['EN']
            }
        }, (err) => {

            expect(err).to.be.an.instanceof(Error);
            expect(err.code).to.equal('ENOENT');
        });
        done();
    });

    it('schema validation fails 1', (done) => {

        const server = new Hapi.Server();
        server.connection();

        server.register({
            register: require('../'),
            options: {
                //locale_path: Path.join(__dirname, 'locales'),
                default_language: 'EN',
                available_languages: ['EN']
            }
        }, (err) => {

            expect(err).to.be.an.instanceof(Error);
            expect(err.name).to.equal('ValidationError');
            expect(err.details[0].context.key).to.equal('locale_path');
        });
        done();
    });

    it('schema validation fails 2', (done) => {

        const server = new Hapi.Server();
        server.connection();

        server.register({
            register: require('../'),
            options: {
                locale_path: Path.join(__dirname, 'locales'),
                //default_language: 'EN',
                available_languages: ['EN']
            }
        }, (err) => {

            expect(err).to.be.an.instanceof(Error);
            expect(err.name).to.equal('ValidationError');
            expect(err.details[0].context.key).to.equal('default_language');
        });
        done();
    });

    it('schema validation fails 3', (done) => {

        const server = new Hapi.Server();
        server.connection();

        server.register({
            register: require('../'),
            options: {
                locale_path: Path.join(__dirname, 'locales'),
                default_language: 'EN'
                    //available_languages: ['EN']
            }
        }, (err) => {

            expect(err).to.be.an.instanceof(Error);
            expect(err.name).to.equal('ValidationError');
            expect(err.details[0].context.key).to.equal('available_languages');
        });
        done();
    });

    it('schema validation passes', (done) => {

        const server = new Hapi.Server();
        server.connection();

        server.register({
            register: require('../'),
            options: {
                locale_path: Path.join(__dirname, 'locales'),
                default_language: 'EN',
                available_languages: ['EN']
            }
        }, (err) => {

            expect(err).to.be.undefined();
        });
        done();
    });

    it('schema validation fails because of extra option value', (done) => {

        const server = new Hapi.Server();
        server.connection();

        server.register({
            register: require('../'),
            options: {
                locale_path: Path.join(__dirname, 'locales'),
                default_language: 'EN',
                available_languages: ['EN'],
                dumb: 'foo'
            }
        }, (err) => {

            expect(err).to.be.an.instanceof(Error);
            expect(err.name).to.equal('ValidationError');
            expect(err.details[0].message).to.equal('"dumb" is not allowed');
        });
        done();
    });

    it('returns valid localized strings for EN', (done) => {

        const server = new Hapi.Server();
        server.connection();

        server.register({
            register: require('../'),
            options: {
                locale_path: Path.join(__dirname, 'locales'),
                default_language: 'EN',
                available_languages: ['EN', 'TR']
            }
        }, (err) => {

            expect(err).to.not.exist();
        });

        server.route({
            method: 'GET',
            path: '/',
            config: {
                handler: (request, reply) => {

                    expect(request.i18n).to.exist();
                    const localized = {
                        hello: request.i18n('Hello'),
                        say_hello_to: request.i18n('Say Hello To', 'Isaac'),
                        number: request.i18n('1'),
                        number_not_exist: request.i18n(198),
                        xxx: request.i18n('XXX'),
                        not_exist: request.i18n('Hohoho')
                    };
                    return reply({
                        localized: localized
                    });
                }
            }
        });
        const options = {
            method: 'GET',
            url: '/',
            headers: {
                'Accept-Language': 'en-US,en;q=0.7,tr'
            }
        };
        server.inject(options, (res) => {

            expect(res.result).to.exist();
            expect(res.result.localized).to.exist();
            const localized = res.result.localized;
            expect(localized.hello).to.equal('Hello!');
            expect(localized.say_hello_to).to.equal('Hello Isaac!');
            expect(localized.number).to.equal('Number 1');
            expect(localized.xxx).to.equal('EN XX');
            expect(localized.number_not_exist).to.equal('198');
            expect(localized.not_exist).to.equal('Hohoho');
            done();
        });
    });


    it('returns valid localized strings from default language when available languages mismatch with default one', (done) => {

        const server = new Hapi.Server();
        server.connection();

        server.register({
            register: require('../'),
            options: {
                locale_path: Path.join(__dirname, 'locales'),
                default_language: 'EN',
                available_languages: ['EN', 'TR']
            }
        }, (err) => {

            expect(err).to.not.exist();
        });

        server.route({
            method: 'GET',
            path: '/',
            config: {
                handler: (request, reply) => {

                    expect(request.i18n).to.exist();
                    const localized = {
                        hello: request.i18n('Hello')
                    };
                    return reply({
                        localized: localized
                    });
                }
            }
        });

        const options = {
            method: 'GET',
            url: '/',
            headers: {
                'Accept-Language': 'en-US,en;q=0.7,tr'
            }
        };
        server.inject(options, (res) => {

            expect(res.result).to.exist();
            expect(res.result.localized).to.exist();
            const localized = res.result.localized;
            expect(localized.hello).to.equal('Hello!');
            done();
        });
    });


    it('returns valid localized strings for TR', (done) => {

        const server = new Hapi.Server();
        server.connection();

        server.register({
            register: require('../'),
            options: {
                locale_path: Path.join(__dirname, 'locales'),
                default_language: 'TR',
                available_languages: ['EN', 'TR']
            }
        }, (err) => {

            expect(err).to.not.exist();
        });

        server.route({
            method: 'GET',
            path: '/',
            config: {
                handler: (request, reply) => {

                    expect(request.i18n).to.exist();
                    const localized = {
                        hello: request.i18n('Hello'),
                        say_hello_to: request.i18n('Say Hello To', 'Isaac'),
                        number: request.i18n('1'),
                        xxx: request.i18n('XXX'),
                        not_exist: request.i18n('Hohoho')
                    };
                    return reply({
                        localized: localized
                    });
                }
            }
        });

        const options = {
            method: 'GET',
            url: '/',
            headers: {
                'Accept-Language': 'tr,en-US,en;q=0.7'
            }
        };
        server.inject(options, (res) => {

            expect(res.result).to.exist();
            expect(res.result.localized).to.exist();
            const localized = res.result.localized;
            expect(localized.hello).to.equal('Merhaba!');
            expect(localized.say_hello_to).to.equal('Selam Isaac!');
            expect(localized.number).to.equal('1 Numara');
            expect(localized.xxx).to.equal('XXX');
            expect(localized.not_exist).to.equal('Hohoho');
            done();
        });
    });

    it('Validates templates and locale are working', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(require('vision'));
        server.views({
            engines: {
                html: require('handlebars') // means .ext is .html
            },
            path: Path.join(__dirname, 'views'),
            isCached: false
        });

        server.register([{
            register: require('./plugins/dummyPlugin')
        }, {
            register: require('../'),
            options: {
                locale_path: Path.join(__dirname, 'locales'),
                default_language: 'EN',
                available_languages: ['EN', 'TR']
            }
        }], (err) => {

            expect(err).to.not.exist();
        });

        server.route({
            method: 'GET',
            path: '/',
            config: {
                handler: (request, reply) => {

                    expect(request.raw.req.headers['accept-language']).to.exist();
                    expect(request.raw.req.headers['accept-language']).to.equal('en-US,en;q=0.7, tr');
                    expect(request.dummy).to.exist();
                    expect(request.i18n).to.exist();
                    return reply.view('index');
                }
            }
        });

        const options = {
            method: 'GET',
            url: '/',
            headers: {
                'Accept-Language': 'en-US,en;q=0.7, tr'
            }
        };
        server.inject(options, (res) => {

            const tokens = res.result.split('\n');
            expect(tokens[2]).to.equal('Hello!');
            expect(tokens[3]).to.equal('Hello Isaac!');
            done();
        });
    });

    it('What happens when a back Accept-Language is passed in?', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register(require('vision'));
        server.views({
            engines: {
                html: require('handlebars') // means .ext is .html
            },
            path: Path.join(__dirname, 'views'),
            isCached: false
        });

        server.register([{
            register: require('../'),
            options: {
                locale_path: Path.join(__dirname, 'locales'),
                default_language: 'TR',
                available_languages: ['EN', 'TR']
            }
        }], (err) => {

            expect(err).to.not.exist();
        });

        server.route({
            method: 'GET',
            path: '/',
            config: {
                handler: (request, reply) => {

                    expect(request.raw.req.headers['accept-language']).to.exist();
                    expect(request.i18n).to.exist();
                    return reply.view('index');
                }
            }
        });

        const options = {
            method: 'GET',
            url: '/',
            headers: {
                'Accept-Language': 'booger'
            }
        };
        server.inject(options, (res) => {

            const tokens = res.result.split('\n');
            expect(tokens[2]).to.equal('Merhaba!');
            expect(tokens[3]).to.equal('Selam Isaac!');
            done();
        });
    });

});
