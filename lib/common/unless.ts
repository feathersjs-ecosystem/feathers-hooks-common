
module.exports = function (_iffElse: any) {
  return function (unlessFcn: any, ...rest: any[]) {
    if (typeof unlessFcn === 'function') {
      return _iffElse(unlessFcn, null, rest);
    }

    return _iffElse(unlessFcn, null, rest);
  };
};
