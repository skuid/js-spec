"use strict";

const Server = require("./server");

Server.start((err) => {
	if(err) {
		Server.log(["error"], "Failed to start server");
		throw err;
	}
	Server.log(["info"], "Starting server at " + Server.info.uri);
});
