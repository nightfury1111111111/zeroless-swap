const rewireUglifyjs = require('react-app-rewire-uglifyjs');

/* config-overrides.js */
module.exports = function override(config, env) {
  config = rewireUglifyjs(config);
  return config;
}