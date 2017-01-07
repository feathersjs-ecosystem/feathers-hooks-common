
module.exports = Object.assign({},
  require('./services/alter-data'),
  require('./services/query-params'),
  require('./services/populate'),
  require('./services/legacyPopulate'),
  require('./services/serialize'),
  require('./services/database'),
  require('./services/validate'),
  require('./services/utilities'),
  require('./services/conditionals'),
  require('./services/utils'),
);
