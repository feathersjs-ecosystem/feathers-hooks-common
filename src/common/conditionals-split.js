// temporary module

import iffElse from './iff-else';
import iff from './iff';
import unless from './unless';
import some from './some';
import every from './every';
import isNot from './is-not';

// processFuncArray must handle case of null param.
export default function Conditionals (processFuncArray) {
  if (!(this instanceof Conditionals)) {
    return new Conditionals(processFuncArray);
  }

  const _iffElse = iffElse(processFuncArray);

  return {
    iffElse: _iffElse,
    iff: iff(_iffElse),
    when: iff(_iffElse),
    unless: unless(_iffElse),
    some,
    every,
    isNot
  };
}
