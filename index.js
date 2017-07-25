"use strict";

const _ = require("lodash");

function getDefaultServer(serverOptions) {

	const Server = require("./server");

	server.connection(_.defaults(options, {
		host: '127.0.0.1',
		port: 3000
	}));

	return Server;
}

function runServer(server) {
	server.start((err) => {
		if(err) {
			server.log(["error"], "Failed to start server");
			throw err;
		}
		server.log(["info"], "Starting server at " + server.info.uri);
	});
}

module.exports = {
	getDefaultServer,
	runServer,
};
