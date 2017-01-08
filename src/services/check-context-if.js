
import checkContext from './check-context';

export default function (hook, type, methods, label) {
  if (type && hook.type === type) {
    checkContext(hook, type, methods, label);
  }
}
