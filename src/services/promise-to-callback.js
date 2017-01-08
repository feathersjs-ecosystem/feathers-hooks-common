
/* globals setImmediate:1 */

const asap = process && typeof process.nextTick === 'function'
  ? process.nextTick : setImmediate;

export default function (promise) {
  return cb => {
    promise.then(
      data => {
        asap(cb, null, data);
        return data;
      },
      err => {
        asap(cb, err);
      });

    return null;
  };
}
