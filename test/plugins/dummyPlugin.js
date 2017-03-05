'use strict';

exports.register = function (server, options, next) {

    server.ext('onPreResponse', (request, reply) => {

        const response = request.response;
        // if response type view!
        if (response.variety === 'view') {
            response.source.context = response.source.context || {};
            response.source.context.dummy = request.dummy; //dummy function
        }
        return reply.continue();
    });

    // Insert dummy into view context
    server.ext('onPostAuth', (request, reply) => {

        if (typeof request.dummy === 'undefined') {
            request.dummy = (dummyParameter) => 'dummyReturnValue';
        }
        return reply.continue();
    });

    next();
};

exports.register.attributes = {
    name: 'dummyPlugin',
    version: '0.0.1'
};
