
/* globals setImmediate:1 */

const asap = process && typeof process.nextTick === 'function'
  ? process.nextTick : setImmediate;

module.exports = function (promise) {
  console.log('**Deprecated** The promiseToCallback hook will be removed next FeathersJS version.');

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
};
