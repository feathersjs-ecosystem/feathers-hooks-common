
/* globals setImmediate:1 */

module.exports = function (promise) {
  console.log('**Deprecated** The promiseToCallback hook will be removed next FeathersJS version.');

  const asap = process && typeof process.nextTick === 'function'
    ? process.nextTick : setImmediate;

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
