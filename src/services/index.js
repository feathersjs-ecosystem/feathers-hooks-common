
module.exports = Object.assign({},
  require('./alter-data-split'),
  require('./query-params'),
  require('./populate'),
  require('./legacyPopulate'),
  require('./serialize'),
  require('./database'),
  require('./validate'),
  require('./utilities'),
  require('./conditionals-split'),
  require('./utils'), // this is the split file.
);
