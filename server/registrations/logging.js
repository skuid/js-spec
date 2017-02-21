"use strict";

const _ = require("lodash");

module.exports = function(server){
	
	const options = {
		ops: false,
		includes: {
			request: ["headers"]
		},
		reporters: {
			consoleReporter: [
				{
					// Good's module loading is broken and looks in the `node_modules` subfolder.
					module: "../../../server/plugins/logger",
					name: "ObjectFormatter",
				},
				{
					module: "../../../server/plugins/logger",
					name: "LevelFilter",
				},
				{
					module: "../../../server/plugins/logger",
					name: "JsonLogger",
				},
				"stdout"
			]
		}
	};

	server.decorate("request", "errorLog", function(tags, err, timestamp = null){
	
		if(tags instanceof Error){
			err = tags;
			tags = ["error"];
		}

		tags = _.union(["error"], tags);
		
		this.log(tags, {
			message: err.message,
			stack: err.stack
		}, timestamp);
	});

	
	return server.register({
		register: require("good"),
		options
	});
};