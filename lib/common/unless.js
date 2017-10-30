
module.exports = function (_iffElse) {
  return function (unlessFcn, ...rest) {
    if (typeof unlessFcn === 'function') {
      return _iffElse(unlessFcn, null, rest);
    }

    return _iffElse(unlessFcn, null, rest);
  };
};
