'use strict';

const routes = {
    register: (server, options, next) => {

        server.route({
            method: 'GET',
            path: '/',
            config: {
                auth: false, //Public access allowed
                description: 'Route is website root'
            },
            handler: (request, reply) => {

                reply(`Hello ${request.i18n('world')}!`);
            }
        });
        next();
    }
};

routes.register.attributes = {
    name: 'applicationRoutes',
    version: '1.0.0'
};

module.exports = routes;
