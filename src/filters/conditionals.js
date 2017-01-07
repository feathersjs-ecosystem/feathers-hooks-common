
import combine from './combine';
import Conditionals from '../common/conditionals-split';

const conditionals = new Conditionals(
  (filterFnArgs, eventFilters) =>
    eventFilters ? combine(...eventFilters).call(this, filterFnArgs) : filterFnArgs[0]
);

export default Object.assign(
  { combine },
  conditionals,
);
