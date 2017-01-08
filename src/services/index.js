
module.exports = Object.assign({},
  require('./alter-data-split'),
  require('./query-params-split'),
  require('./populate'),
  require('./legacyPopulate'),
  require('./serialize'),
  require('./database-split'),
  require('./validate'),
  require('./utilities'),
  require('./conditionals-split'),
  require('./utils'), // this is the split file.
);
