'use strict';

const Boom = require('boom');

class LifecycleHandler {
    constructor() {
        this.ready = true;
        this.healthy = true;
    }

    endpoints() {
        return [
            {
                method: 'GET',
                path: '/ready',
                handler: (request, reply) => {
                    if (this.ready) {
                       reply("WE READY!"); 
                    } else {
                       reply(Boom.serverUnavailable('Server is not ready.'));
                    }
                }
            },{
                method: 'GET',
                path: '/health',
                handler: (request, reply) => {
                    if (this.healthy) {
                       reply("WE HEALTHY!"); 
                    } else {
                       reply(Boom.serverUnavailable('Server is not healthy.'));
                    }
                }
            },{
                method: 'POST',
                path: '/flip',
                handler: (request, reply) => {
                    if (this.ready === true) {
                        this.ready = false;
                    } else {
                        this.ready = true;
                    }
                    reply("Readyness bit flipped.");
                }
            }
        ]
    }

    registerSigTermHandler(server) { 
        process.on("SIGTERM", () => {
            this.ready = false;
            server.log(["fatal"], "Got SIGTERM. Graceful shutdown start");
            server.stop({ timeout: 5 * 1000}, () => {
                process.exit(0);
            });
        });
    }
}

module.exports = {
    "handler": new LifecycleHandler()
}