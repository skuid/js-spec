'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/ready',
        handler: function (request, response) {
            response("WE READY");
        }
    },{
        method: 'GET',
        path: '/health',
        handler: function (request, response) {
            response("WE HEALTHY");
        }
    }
];