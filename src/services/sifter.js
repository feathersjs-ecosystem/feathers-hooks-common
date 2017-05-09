
import errors from 'feathers-errors';

import checkContext from './check-context';
import getItems from './get-items';
import replaceItems from './replace-items';

// import sift from 'sift';
// getSifter = hook => sift({ 'address.country': hook.params.country }
export default function (getSifter) {
  return hook => {
    checkContext(hook, 'after', 'find', 'sifter');

    if (typeof getSifter !== 'function') {
      throw new errors.BadRequest(`The sifter param must be a function. (sifter)`);
    }

    const sifter = getSifter(hook);

    if (typeof sifter !== 'function') {
      throw new errors.BadRequest(`The result of calling the sifter param must be a function. (sifter)`);
    }

    replaceItems(hook, getItems(hook).filter(sifter));

    return hook;
  };
}
