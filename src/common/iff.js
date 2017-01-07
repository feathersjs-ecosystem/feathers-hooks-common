
export default function (_iffElse) {
  return function (predicate, ...rest) {
    const trueHooks = [].concat(rest);
    const that = this;

    function iffWithoutElse (hook) {
      return _iffElse(predicate, trueHooks, null).call(that, hook);
    }
    iffWithoutElse.else = (...falseHooks) => _iffElse(predicate, trueHooks, falseHooks);

    return iffWithoutElse;
  };
}
