
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

export const getByDot = (obj, path) => {
  if (path.indexOf('.') === -1) {
    return obj[path];
  }
  
  return path.split('.').reduce(
    (obj1, part) => (typeof obj1 === 'object' ? obj1[part] : undefined),
    obj
  );
};

export const setByDot = (obj, path, value, ifDelete) => {
  if (path.indexOf('.') === -1) {
    obj[path] = value;
    
    if (value === undefined && ifDelete) {
      delete obj[path];
    }
    
    return;
  }
  
  const parts = path.split('.');
  const lastIndex = parts.length - 1;
  return parts.reduce(
    (obj1, part, i) => {
      if (i !== lastIndex) {
        if (!obj1.hasOwnProperty(part) || typeof obj1[part] !== 'object') {
          obj1[part] = {};
        }
        return obj1[part];
      }
      
      obj1[part] = value;
      if (value === undefined && ifDelete) {
        delete obj1[part];
      }
      return obj1;
    },
    obj
  );
};
