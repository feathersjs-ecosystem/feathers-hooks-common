
import iffElse from './iff-else';

export default function (predicate, ...rest) {
  const trueHooks = [].concat(rest);

  const iffWithoutElse = function (hook) {
    return iffElse(predicate, trueHooks, null).call(this, hook);
  };
  iffWithoutElse.else = (...falseHooks) => iffElse(predicate, trueHooks, falseHooks);

  return iffWithoutElse;
}
