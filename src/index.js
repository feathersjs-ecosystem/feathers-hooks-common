
/* eslint-env es6, node */

require('babel-polyfill'); // for node 4

module.exports = Object.assign({},
  require('./common'),
  require('./bundled'),
  require('./new')
);
