
module.exports = function (obj, path, value, ifDelete) {
  if (ifDelete) {
    console.log('DEPRECATED. Use deleteByDot instead of setByDot(obj,path,value,true). (setByDot)');
  }

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
