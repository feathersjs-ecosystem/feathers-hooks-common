
import { getItems, replaceItems } from './utils';

export const dePopulate = () => hook => {
  const items = getItems(hook);

  (Array.isArray(items) ? items : [items]).forEach(item => {
    if ('_computed' in item) {
      item._computed.forEach(key => { delete item[key]; });
      delete item._computed;
    }

    if ('_include' in item) {
      item._include.forEach(key => { delete item[key]; });
      delete item._include;
    }

    delete item._elapsed;
  });

  replaceItems(hook, items);
  return hook;
};

