
module.exports = function (obj, path) {
  if (path.indexOf('.') === -1) {
    return obj[path];
  }

  return path.split('.').reduce(
    (obj1, part) => (typeof obj1 === 'object' ? obj1[part] : undefined),
    obj
  );
};
