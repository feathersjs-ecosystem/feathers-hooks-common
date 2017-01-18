
import errors from 'feathers-errors';

export default function (obj, path) {
  const parts = path.split('.');
  const nonLeafLen = parts.length - 1;

  for (let i = 0; i < nonLeafLen; i++) {
    let part = parts[i];
    console.log(path, part, part in obj);
    if (!(part in obj)) { return; }

    obj = obj[part];

    if (typeof obj !== 'object' || obj === null) {
      throw new errors.BadRequest(`Path '${path}' does not exist. (deleteByDot)`);
    }
  }

  delete obj[parts[nonLeafLen]];
}
