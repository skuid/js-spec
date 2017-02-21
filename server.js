'use strict';

const Hapi = require('hapi');
const Good = require('good');

const SKUID_ENV = process.env.SKUID_ENVIRONMENT;

// Create a server with a host and port
const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 3000
});

// Add the route
server.route({
    method: 'GET',
    path:'/hello',
    handler: function (request, reply) {
        return reply('hello world');
    }
});



// Register logging

require("./server/registrations/logging")(server)

module.exports = server;