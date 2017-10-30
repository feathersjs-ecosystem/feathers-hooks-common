
module.exports = function (_iffElse) {
  return function (predicate, ...trueHooks) {
    const that = this;

    function iffWithoutElse (hook) {
      return _iffElse(predicate, [].concat(...trueHooks), null).call(that, hook);
    }
    iffWithoutElse.else = (...falseHooks) => _iffElse(predicate, [].concat(...trueHooks), [].concat(...falseHooks));

    return iffWithoutElse;
  };
};
