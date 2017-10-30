
const combine = require('./combine');
const _conditionals = require('../common/_conditionals');
const pluck = require('./pluck');
const remove = require('./remove');
const setFilteredAt = require('./set-filtered-at');
const traverse = require('./traverse');

const conditionals = _conditionals(
  function (filterFnArgs, eventFilters) {
    return eventFilters ? combine(...eventFilters).call(this, filterFnArgs) : filterFnArgs[0];
  }
);

module.exports = Object.assign({ combine,
  pluck,
  remove,
  setFilteredAt,
  traverse
}, conditionals);
