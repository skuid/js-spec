"use strict";

const metrics = require("./metrics");

const skuidMetrics = {
	register: function(server, options, next) {
		server.route({
			method: "GET",
			path: "/skuid/metrics",
			handler: function index(request, reply){
				reply(metrics.summary()).header("content-type", "text/plain").code(200);
			},
			config: {plugins: {good: {suppressResponseEvent: true}}}
		});

		server.ext("onRequest", (request, reply) => {
			request.skuid = {
				start: process.hrtime()
			};

			return reply.continue();
		});

		server.on("response", function(response){
			metrics.observe(response.method, response.path, response.response.statusCode, response.skuid.start);
		});

		metrics.server = server;

		next();
	}
};

skuidMetrics.register.attributes = {
	name: "skuid-metrics",
	version: "0.0.1"
};

module.exports = {
	register: skuidMetrics.register
};