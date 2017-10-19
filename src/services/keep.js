import checkContextIf from './check-context-if';
import getItems from './get-items';
import replaceItems from './replace-items';
import getByDot from '../common/get-by-dot';
import setByDot from '../common/set-by-dot';

export default function (...fieldNames) {
  return context => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'keep');
    const items = getItems(context);

    if (Array.isArray(items)) {
      replaceItems(context, items.map(item => replaceItem(item, fieldNames)));
    } else {
      replaceItems(context, replaceItem(items, fieldNames));
    }

    return context;
  };
}

function replaceItem (item, fields) {
  const newItem = {};
  fields.forEach(field => {
    const value = getByDot(item, field);
    if (value) {
      setByDot(newItem, field, value);
    }
  });
  item = newItem;
  return item;
}
