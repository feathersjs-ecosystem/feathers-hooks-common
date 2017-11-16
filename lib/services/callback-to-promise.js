
module.exports = function (func, paramsCountExcludingCb) {
  console.log('**Deprecated** The callbackToPromise utility will be removed next FeathersJS version. Use Node\'s util.promisify.');
  paramsCountExcludingCb = Math.max(paramsCountExcludingCb, 0);

  return (...args) => {
    const self = this;

    // Get the correct number of args
    const argsLen = args.length;
    if (argsLen < paramsCountExcludingCb) {
      // Array.apply(null, Array(5)) creates a dense array of 5 undefined
      const extraArgs = Array.apply(null, Array(paramsCountExcludingCb - argsLen));
      args = Array.prototype.concat.call(args, extraArgs);
    }
    if (args.length > paramsCountExcludingCb) {
      args = Array.prototype.slice.call(args, 0, paramsCountExcludingCb);
    }

    return new Promise((resolve, reject) => { // eslint-disable-line consistent-return
      args.push((err, data) => (err ? reject(err) : resolve(data)));
      func.apply(self, args);
    });
  };
};
