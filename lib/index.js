'use strict';

const Fs = require('fs');
const I18n = require('./i18n');
const Joi = require('joi');
const Alparser = require('accept-language-parser');

const internals = {};

internals.schema = Joi.object().keys({
    locale_path: Joi.string().required(),
    cookie_name: Joi.string().default('language'),
    default_language: Joi.string().required(),
    available_languages: Joi.array().items(Joi.string()).required()
});

exports.register = function (server, options, next) {

    // Validate options agains the JOI scheam above
    const validationResults = internals.schema.validate(options);
    if (validationResults.error) {
        return next(validationResults.error);
    }

    // Validate if the locale or language files actually exist.
    try {
        options.available_languages.forEach((locale) => {

            Fs.statSync(`${options.locale_path}/${locale.toLowerCase()}.js`, (err) => {
                // $lab:coverage:off$
                if (err) {
                    throw (err);
                };
                // $lab:coverage:on$
            });
        });
    }
    catch (err) {

        return next(err);
    }

    // Insert i18n into view context
    let language = options.default_language;

    server.ext('onPreResponse', (request, reply) => {

        const response = request.response;
        // if response type view!
        if (response.variety === 'view') {
            // $lab:coverage:off$
            response.source.context = response.source.context || {};
            // $lab:coverage:on$
            response.source.context.i18n = request.i18n;
        }
        return reply.continue();
    });

    // Insert i18n into view context
    server.ext('onPostAuth', (request, reply) => {


        // $lab:coverage:off$
        language = Alparser.parse(request.raw.req.headers['accept-language'] || '');
        // $lab:coverage:on$
        language = language.map((languageObject) => {

            return languageObject.code.toUpperCase();
        });
        language.some((languageCode) => {

            if (options.available_languages.indexOf(languageCode) !== -1) {
                request.i18n = I18n(languageCode, options.locale_path);
                return true;
            }
            return false;
        });
        if (typeof request.i18n === 'undefined') {
            //console.log(`${language} => part is not in the available languages: ${options.available_languages.join(',')}`);
            request.i18n = I18n(options.default_language, options.locale_path);
        }
        return reply.continue();
    });

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
