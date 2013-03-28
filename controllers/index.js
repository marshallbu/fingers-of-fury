var fs = require('fs')
  , basename = require('path').basename;

/**
 * Controllers module.
 *
 * This module will autoload controllers in this directory. A controller
 * will only be require() loaded if it is in fact used by the app (that's
 * what __defineGetter__ provides!).
 *
 */
module.exports = function(options) {
  var options = options || {}
    , verbose = options.verbose
    , ret = {}
    , selfBasename = basename(__filename);

  // Similar to Connect's connect.js middleware autoloading
  fs.readdirSync(__dirname).forEach(function(filename) {
    if (filename === selfBasename) return;
    verbose && console.log('Registering controller %s for autoload:', filename);
    var name = basename(filename, '.js');
    function load(){ return require('./' + name); }
    ret.__defineGetter__(name, load);
  });

  return ret;
};