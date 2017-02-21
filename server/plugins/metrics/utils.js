"use strict";

function parse(path) {
	var ret = path;
	if (path[path.length - 1] != "/") {
		if (!path.includes(".")) {
			ret = path.substr(0, path.lastIndexOf("/") + 1);
		}
	}
	return ret;
}

function pathNotInBlacklist(path, method, server) {
	var pathIsLoggable = true;
	var assetPath = new RegExp("^\/assets\/.*$");
	if (path == "/skuid/metrics" || path == "/skuid/metrics/") {
		pathIsLoggable = false;
	}
	if (assetPath.test(path)) {
		pathIsLoggable = false;
	}
	if (path == "/favicon.ico") {
		pathIsLoggable = false;
	}
	return pathIsLoggable;
}

function ms(start) {
	var diff = process.hrtime(start);
	return Math.round((diff[0] * 1e9 + diff[1]) / 1000000);
}

module.exports = {
	parse: parse,
	pathNotInBlacklist: pathNotInBlacklist,
	ms: ms
};
