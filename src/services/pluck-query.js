
import _pluck from '../common/_pluck';
import checkContext from './check-context';

export default function (...fieldNames) {
  return context => {
    checkContext(context, 'before', null, 'pluckQuery');

    const query = (context.params || {}).query || {};
    context.params.query = _pluck(query, fieldNames);

    return context;
  };
}
