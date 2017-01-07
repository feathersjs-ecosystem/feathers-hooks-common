// temporary module

import iffElse from './iff-else';
import iff from './iff';
import unless from './unless';
import some from './some';
import every from './every';
import isNot from './is-not';

export default function (processFuncArray) {
  return {
    iffElse: iffElse(processFuncArray),
    iff,
    when: iff,
    unless,
    some,
    every,
    isNot
  };
}
