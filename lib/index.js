/**
 *
 * @File: index.js
 * @Reference: http://hapijs.com/api#plugin-interface
 *
 */

var Hoek = require("hoek");
var i18n = require("./i18n");
var alparser = require("accept-language-parser");

var internals = {};
internals.defaults = {
    locale_path: "./config/languages",
    cookie_name: "language",
    default_language: "en",
    available_languages: ["en", "tr"]

};

exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults(internals.defaults, options);

    // Insert i18n into view context
    var language = options.default_language;

    server.ext("onPreResponse", function (request, reply) {

        var response = request.response;

        // if response type view!
        if (response.variety === "view") {
            response.source.context = response.source.context || {};
            response.source.context.i18n = request.i18n;
        }
        return reply.continue();
    });

    //// Insert i18n into view context
    server.ext("onPostAuth", function (request, reply) {
        language = alparser.parse(request.raw.req.headers["accept-language"] || "");
        language = language.map((languageObject) => {
            return languageObject.code.toUpperCase();
        });
        language.some((languageCode) => {
            if (options.available_languages.indexOf(languageCode) != -1) {
                request.i18n = i18n(languageCode, options.locale_path);
                return true;
            }
            return false;
        });
        if (request.i18n == undefined) {
            console.log(language + " => part is not in the available languages: " + options.available_languages.join(","));
            request.i18n = i18n(options.default_language, options.locale_path);
        }
        return reply.continue();
    });

    next();
};

exports.register.attributes = {
    pkg: require("../package.json")
};
