// temporary module

import iffElse from './iffElse';
import iff from './iff';
import unless from './unless';
import some from './some';
import every from './every';
import isNot from './isNot';

module.exports = function (processFuncArray) {
  return {
    iffElse: iffElse(processFuncArray),
    iff,
    when: iff,
    unless,
    some,
    every,
    isNot
  };
};
