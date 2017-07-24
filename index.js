"use strict";

const _ = require("lodash");

function runServer(serverOptions) {

	const Server = require("./server");

	server.connection(_.defaults(options, {
		host: '127.0.0.1',
		port: 3000
	}));

	Server.start((err) => {
		if(err) {
			Server.log(["error"], "Failed to start server");
			throw err;
		}
		Server.log(["info"], "Starting server at " + Server.info.uri);
	});
}

module.exports = runServer;
