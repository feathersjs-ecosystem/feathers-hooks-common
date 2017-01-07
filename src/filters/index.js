
import combine from './combine';
import Conditionals from '../common/conditionals-split';
import pluck from './pluck';
import remove from './remove';
import setFilteredAt from './set-filtered-at';
import traverse from './traverse';

const conditionals = Conditionals(
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
  conditionals,
);
