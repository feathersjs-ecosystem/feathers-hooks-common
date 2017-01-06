
import iff from './iff';
import isNot from './isNot';

module.exports = function (unlessFcn, ...rest) {
  if (typeof unlessFcn === 'function') {
    return iff(isNot(unlessFcn), ...rest);
  }

  return iff(!unlessFcn, ...rest);
};
