const existsByDot = require('../common/exists-by-dot');
const getByDot = require('../common/get-by-dot');
const setByDot = require('../common/set-by-dot');

module.exports = function makeCallingParams (
  context, query, include = ['params.provider', 'params.authenticated', 'params.user'], inject = {}
) {
  const included = query ? { query } : {};

  if (include) {
    (Array.isArray(include) ? include : [include]).forEach(name => {
      if (existsByDot(context, name)) setByDot(included, name, getByDot(context, name));
    });
  }

  return Object.assign({ _populate: 'skip' }, included, inject);
};
