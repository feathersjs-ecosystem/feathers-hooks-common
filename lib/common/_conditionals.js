
const iffElse = require('./iff-else');
const iff = require('./iff');
const unless = require('./unless');
const some = require('./some');
const every = require('./every');
const isNot = require('./is-not');

module.exports = function conditionals (processFuncArray) {
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
};
