"use strict";

const Stream = require("stream");

/**
 * JsonLogger dumps each message as newline terminated JSON. This should be used last in a chain
 */
class JsonLogger extends Stream.Transform {
	constructor(options={}) {
		options.objectMode = true;
		super(options);
	}

	_transform(chunk, encoding, callback) {
		return callback(null, JSON.stringify(chunk) + "\n");
	}
}

module.exports = JsonLogger;