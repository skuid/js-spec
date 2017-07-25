'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Lifecycle = require('./server/lifecycle');

const SKUID_ENV = process.env.SKUID_ENVIRONMENT;

// Create a server with a host and port
const server = new Hapi.Server();

// Add the route
server.route({
    method: 'GET',
    path:'/hello',
    handler: function (request, reply) {
        return reply('hello world');
    }
});

// Register logging
require("./server/registrations/logging")(server);
require("./server/registrations/metrics")(server);

// Register lifecycle/readyness handlers
server.route(Lifecycle.handler.endpoints());

// Register sigterm handler for health checks.
Lifecycle.handler.registerSigTermHandler(server);

module.exports = server;