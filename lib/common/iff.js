
module.exports = function (_iffElse) {
  return function (predicate, ...trueHooks) {
    function iffWithoutElse (context) {
      return _iffElse(predicate, [].concat(...trueHooks), null).call(this, context);
    }
    iffWithoutElse.else = (...falseHooks) => _iffElse(predicate, [].concat(...trueHooks), [].concat(...falseHooks));

    return iffWithoutElse;
  };
};
