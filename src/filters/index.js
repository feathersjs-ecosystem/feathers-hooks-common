
import combine from './combine';
import _conditionals from '../common/_conditionals';
import pluck from './pluck';
import remove from './remove';
import setFilteredAt from './set-filtered-at';
import traverse from './traverse';

const conditionals = _conditionals(
  function (filterFnArgs, eventFilters) {
    return eventFilters ? combine(...eventFilters).call(this, filterFnArgs) : filterFnArgs[0];
  }
);

export default Object.assign(
  { combine,
    pluck,
    remove,
    setFilteredAt,
    traverse
  },
  conditionals
);
