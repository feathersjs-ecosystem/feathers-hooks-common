
module.exports = function (_iffElse: any) {
  return function(this: any, predicate: any, ...trueHooks: any[]) {
    const that = this;

    function iffWithoutElse (context: any) {
      return _iffElse(predicate, [].concat(...trueHooks), null).call(that, context);
    }
    iffWithoutElse.else = (...falseHooks: any[]) => _iffElse(predicate, [].concat(...trueHooks), [].concat(...falseHooks));

    return iffWithoutElse;
  };
};
