
/* eslint arrow-body-style: 0, consistent-return: 0, no-param-reassign: 0,
no-unused-vars: 0, no-var: 0 */

const aHook = {};
function setCreatedAt() {}

// example of a checking function

const ifExternal = (... args) => hook => !!hook.params.provider; // include with repo?

// ===> the hook supporting conditional hooks

export const iff = (ifFcn, hookFcn) => (hook) => {
  const check = ifFcn(hook);

  if (check && typeof check.then === 'function') {
    return check.then(check1 => check1 ? hookFcn(hook) : hook);
  }

  return check ? hookFcn(hook) : undefined;
};

// example usage

exports.before = {
  create: [
    iff(ifExternal(), setCreatedAt()),
  ],
};
