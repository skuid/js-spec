'use strict';


class LifecycleHandler {
    constructor() {
        this.ready = true;
        this.healthy = true;
    }

    endpoints() {
        console.log(this);
        return [
            {
                method: 'GET',
                path: '/ready',
                handler: (request, reply) => {
                    if (this.ready) {
                       reply("WE READY!"); 
                    } else {
                       reply("WE NOT READY!");
                    }
                }
            },{
                method: 'GET',
                path: '/health',
                handler: (request, reply) => {
                    if (this.healthy) {
                       reply("WE HEALTHY!"); 
                    } else {
                       reply("WE NOT HEALTHY!");
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
                    reply("Readyness bit flipped.")
                }
            }
        ]
    }
}

module.exports = {
    "handler": new LifecycleHandler()
}