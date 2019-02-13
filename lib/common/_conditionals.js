
const _iffElse = require('./iff-else');
const _iff = require('./iff');
const _unless = require('./unless');
const some = require('./some');
const every = require('./every');
const isNot = require('./is-not');

module.exports = function conditionals(processFuncArray) {
  const iffElse = _iffElse(processFuncArray);
  const iff = _iff(_iffElse);
  const unless = _unless(_iffElse);

  return {
    iffElse,
    iff,
    when: iff,
    unless,
    some,
    every,
    isNot
  };
};
