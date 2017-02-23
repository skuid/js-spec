"use strict";

module.exports = function(server){
	return server.register(require("../plugins/metrics"));
};