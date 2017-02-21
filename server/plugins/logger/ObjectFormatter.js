"use strict";

const _ = require("lodash");
const Moment = require("moment");
const Hoek = require("hoek");
const Stream = require("stream");
const querystring = require("querystring");

const internals = {
	defaults: {
		format: "YYYY-MM-DDTHH:mm:ss.SSSZ",
		utc: true,
	}
};

internals.utility = {
	formatOutput(event, settings) {
		let timestamp = Moment(parseInt(event.timestamp, 10));
		if (settings.utc) {
			timestamp = timestamp.utc();
		}
		timestamp = timestamp.format(settings.format);
		event.timestamp = timestamp;

		return event;
	},

	formatDefault(event, tags, settings) {

		let data = {
			"name": event.event,
			"path": event.path,
			"verb": event.method,
			"response_time": event.responseTime,
			"code": event.statusCode,
			"query": querystring.stringify(event.query) || null,
			"tags": tags,
			"remote_addr": event.remoteAddress,
			"timestamp": event.timestamp,
		};

		// handle hapi server logs
		if (event.event == "log"){
			data.message = event.data;
		}

		if (event.source) {
			data.user_agent = event.source.userAgent;
		}

		// Iterate over the event.log objects marked "internal: false" and get the
		// tags and information
		let log_data = {};
		let log_tags = {};
		_.forEach(event.log, function(log){
			if (! log.internal){
				if (log.data && typeof(log.data) == "object"){
					_.extend(log_data, log.data);
				}
				else {
					log_data.message = log.data;
				}
				_.forEach(log.tags, function(tag){
					log_tags[tag] = true;
				});
			}
		});
		_.extend(data, log_data);
		data.tags = data.tags.concat(Object.keys(log_tags));

		// Add a stack trace if an error is present
		if (tags.indexOf("error") != -1 && event.error){
			data["message"] = event.error.message;
			data["stack"] = event.error.stack;
		}

		if(event.event == "response" && event.headers.is_internal_site !== undefined){
			data.internal = event.headers.is_internal_site;
		}

		return internals.utility.formatOutput(data, settings);
	}
};

/**
 * ObjectFormatter formats Hapi events according to our Elasticsearch schema
 *
 * You can exclude a controller from logging by adding:
 *
 * 		config: {plugins: {good: {suppressResponseEvent: true}}}
 *
 */
class ObjectFormatter extends Stream.Transform {
	constructor(options={}) {
		options.objectMode = true;
		super(options);

		options = options || {};
		this._settings = Hoek.applyToDefaults(internals.defaults, options);
	}

	_transform(chunk, encoding, callback) {

		const eventName = chunk.event;
		let tags = [];

		if (Array.isArray(chunk.tags)) {
			tags = chunk.tags.concat([]);
		}
		else if (chunk.tags) {
			tags = [chunk.tags];
		}

		if (tags == []){
			tags.unshift(eventName);
		}

		if (chunk.config && chunk.config.suppressResponseEvent) {
			return callback();
		}

		if (eventName == "request") {
			return callback();
		}

		return callback(null, internals.utility.formatDefault(chunk, tags, this._settings));
	}
}

module.exports = ObjectFormatter;