
module.exports = function (_iffElse) {
  return function (predicate, ...trueHooks) {
    const that = this;

    function iffWithoutElse (context) {
      return _iffElse(predicate, [].concat(...trueHooks), null).call(that, context);
    }
    iffWithoutElse.else = (...falseHooks) => _iffElse(predicate, [].concat(...trueHooks), [].concat(...falseHooks));

    return iffWithoutElse;
  };
};
