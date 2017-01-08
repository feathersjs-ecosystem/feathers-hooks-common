
import { processHooks } from 'feathers-hooks/lib/commons';

export default function (...serviceHooks) {
  return function (hook) {
    return processHooks.call(this, serviceHooks, hook);
  };
}
