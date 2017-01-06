
module.exports = Object.assign({},
  require('./hooks/alter-data'),
  require('./hooks/query-params'),
  require('./hooks/populate'),
  require('./hooks/legacyPopulate'),
  require('./hooks/serialize'),
  require('./hooks/database'),
  require('./hooks/validate'),
  require('./hooks/utilities'),
  require('./hooks/conditionals'),
  require('./hooks/utils'),
);
