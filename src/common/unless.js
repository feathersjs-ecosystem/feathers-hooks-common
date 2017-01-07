
import iff from './iff';
import isNot from './is-not';

export default function (unlessFcn, ...rest) {
  if (typeof unlessFcn === 'function') {
    return iff(isNot(unlessFcn), ...rest);
  }

  return iff(!unlessFcn, ...rest);
}
