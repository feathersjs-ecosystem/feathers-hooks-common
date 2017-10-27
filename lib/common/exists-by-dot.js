
module.exports = function (obj, path) {
  const parts = path.split('.');
  const nonLeafLen = parts.length - 1;

  for (let i = 0; i < nonLeafLen; i++) {
    let part = parts[i];

    if (!(part in obj)) { return false; }

    obj = obj[part];

    if (typeof obj !== 'object' || obj === null) { return false; }
  }

  return parts[nonLeafLen] in obj;
};
