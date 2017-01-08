
module.exports = Object.assign({},
  require('./alter-data-split'),
  require('./query-params-split'),
  require('./database-split'),
  require('./validate-split'),
  require('./utilities-split'),
  require('./conditionals-split'),
  require('./utils'), // this is the split file.
);
