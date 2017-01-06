
import _getByDot from '../common/get-by-dot';
import _setByDot from '../common/set-by-dot';

export const checkContext = (hook, type = null, methods = [], label = 'anonymous') => {
  if (type && hook.type !== type) {
    throw new Error(`The '${label}' hook can only be used as a '${type}' hook.`);
  }

  if (!methods) { return; }

  const myMethods = Array.isArray(methods) ? methods : [methods]; // safe enough for allowed values

  if (myMethods.length > 0 && myMethods.indexOf(hook.method) === -1) {
    const msg = JSON.stringify(myMethods);
    throw new Error(`The '${label}' hook can only be used on the '${msg}' service method(s).`);
  }
};

export const checkContextIf = (hook, type, methods, label) => {
  if (type && hook.type === type) {
    checkContext(hook, type, methods, label);
  }
};

export const getItems = hook => {
  const items = hook.type === 'before' ? hook.data : hook.result;
  return items && hook.method === 'find' ? items.data || items : items;
};

export const replaceItems = (hook, items) => {
  if (hook.type === 'before') {
    hook.data = items;
  } else if (hook.method === 'find' && hook.result && hook.result.data) {
    if (Array.isArray(items)) {
      hook.result.data = items;
      hook.result.total = items.length;
    } else {
      hook.result.data = [items];
      hook.result.total = 1;
    }
  } else {
    hook.result = items;
  }
};

export const getByDot = _getByDot;
export const setByDot = _setByDot;
