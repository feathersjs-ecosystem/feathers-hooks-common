
import { getItems, replaceItems } from './utils';

export const dePopulate = () => hook => {
  const items = getItems(hook);

  (Array.isArray(items) ? items : [items]).forEach(item => {
    removeProps('_computed', item);
    removeProps('_include', item);
    delete item._elapsed;
  });

  replaceItems(hook, items);
  return hook;
};

function removeProps (name, item) {
  if (name in item) {
    item[name].forEach(key => { delete item[key]; });
    delete item[name];
  }
}
