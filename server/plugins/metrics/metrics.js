"use strict";

const prom = require("prom-client");
const Utils = require("./utils");

const metric = {
	version: new prom.Gauge({
		name: "version_info",
		help: "The current git commit and node version.",
		labelNames: [
			"commit",
			"node_version",
		],
	}),
	http: {
		requests: {
			duration: new prom.Summary({
				name: "http_request_duration_milliseconds",
				help: "request duration in milliseconds",
				labelNames: [
					"method",
					"path",
					"status",
				],
			}),
			buckets: new prom.Histogram({
				name: "http_request_buckets_milliseconds",
				help: "request duration buckets in milliseconds. Bucket size set to 500 and 2000 ms to enable apdex calculations with a T of 300ms",
				labelNames: [
					"method",
					"path",
					"status",
				],
				buckets: [
					500,
					2000,
				],
			}),
		},
	}
};

function observe(method, path, statusCode, start) {
	var lowerPath = path.toLowerCase();
	if ( Utils.pathNotInBlacklist(lowerPath, method, this.server) ) {
		var duration = Utils.ms(start);
		var lowerMethod = method.toLowerCase();
		var requestPath = Utils.parse(lowerPath);
		metric.http.requests.duration.labels(lowerMethod, requestPath, statusCode).observe(duration);
		metric.http.requests.buckets.labels(lowerMethod, requestPath, statusCode).observe(duration);
	}
}

metric.version.labels(process.env.GIT_COMMIT || "HEAD", process.versions.node).set(1);

module.exports = {
	summary: prom.register.metrics,
	observe: observe,
};
