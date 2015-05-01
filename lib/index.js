'use strict';

var path = require('path');

var callSites = function () {
  var prepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = function (err, stack) {
    return stack;
  };
  var error = new Error();
  Error.captureStackTrace(error, callSites);
  var stack = error.stack;
  Error.prepareStackTrace = prepareStackTrace;
  return stack;
};

var callerDirname = function () {
  return path.dirname(callSites()[2].getFileName());
};

module.exports = function (options) {
  options = options || {};

  var rootDir = options.rootDir
      ? path.normalize(options.rootDir)
      : callerDirname();

  if (!path.isAbsolute(rootDir)) {
    throw new Error('The root directory must be an absolute path');
  }

  if (options.requireVar) {
    global[options.requireVar] = function (pathname) {
      if (pathname[0] !== '.') {
        // Paths must begin wth a dot to avoid confusion with modules stored
        // inside 'node_modules'
        throw new Error('The module path must begin with a dot \'.\'');
      }
      return require(rootDir + '/' + pathname);
    };
  }

  if (options.rootVar) {
    global[options.rootVar] = rootDir;
  }
};