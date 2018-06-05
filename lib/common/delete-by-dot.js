
const errors = require('@feathersjs/errors');

module.exports = function (obj, path) {
  const parts = path.split('.');
  const nonLeafLen = parts.length - 1;

  for (let i = 0; i < nonLeafLen; i++) {
    let part = parts[i];
    if (!(part in obj)) { return; }

    obj = obj[part];

    if (typeof obj !== 'object' || obj === null) {
      throw new errors.BadRequest(`Path '${path}' does not exist. (deleteByDot)`);
    }
  }

  if (Array.isArray(obj)) {
    obj.splice(parts[nonLeafLen], 1);
  } else {
    delete obj[parts[nonLeafLen]];
  }
};
