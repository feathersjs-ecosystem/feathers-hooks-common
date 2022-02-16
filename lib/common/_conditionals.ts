
const iffElse = require('./iff-else');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'iff'.
const iff = require('./iff');
const unless = require('./unless');
const some = require('./some');
const every = require('./every');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isNot'.
const isNot = require('./is-not');

module.exports = function conditionals (processFuncArray: any) {
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
