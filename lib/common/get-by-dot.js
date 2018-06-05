
module.exports = function (obj, path) {
  if (typeof obj !== 'object' || obj === null) return undefined;

  if (path.indexOf('.') === -1) {
    return obj[path];
  }

  return path.split('.').reduce(
    (obj1, part) => (typeof obj1 === 'object' && obj1 !== null ? obj1[part] : undefined),
    obj
  );
};
