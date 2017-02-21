"use strict";

const _ = require("lodash");
const Stream = require("stream");

/**
 * LevelFilter filters any event with a tag at or above the specified level.
 * The default level is "info".
 */
class LevelFilter extends Stream.Transform {
	constructor(options={}) {
		options.objectMode = true;
		super(options);
	}

	_transform(chunk, encoding, callback) {
		var levelFromName = {
			"trace": 10,
			"debug": 20,
			"info": 30,
			"warn": 40,
			"error": 50,
			"fatal": 60
		};
		var levelOrder = [
			"fatal",
			"error",
			"warn",
			"info",
			"debug",
			"trace"
		];

		var displyLevel = process.env.LOG_LEVEL || "info";
		var displayLevelNumber = levelFromName[displyLevel.toLowerCase()] || levelFromName["info"];

		let tags = [];

		if (Array.isArray(chunk.tags)) {
			tags = chunk.tags;
		}
		else if (chunk.tags) {
			tags = [chunk.tags];
		}
		let eventLevelNumber = 999;

		_.forEach(levelOrder, function(level){
			if (tags.indexOf(level) != -1){
				eventLevelNumber = levelFromName[level];
				return false;
			}
		});


		if (eventLevelNumber < displayLevelNumber){
			return callback(null);
		}

		return callback(null, chunk);
	}

}

module.exports = LevelFilter;