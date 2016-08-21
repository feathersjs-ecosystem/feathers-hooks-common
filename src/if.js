
/* eslint arrow-body-style: 0, consistent-return: 0, no-param-reassign: 0,
no-unused-vars: 0, no-var: 0 */

const aHook = {};
function setCreatedAt() {}

// example of a checking function

const ifExternal = (... args) => hook => !!hook.params.provider; // include with repo?

// ===> the hook supporting conditional hooks

export const iff = (ifFcn, hookFcn) => (hook, next) => {
  const check = ifFcn(hook);

  if (typeof check === 'object' && typeof check.then === 'function') {
    check.then(check1 => {
      return check1 ? hookFcn(hook) : Promise.resolve(hook);
    });
  } else if (check) {
    return hookFcn(hook, next);
  }
};

// example usage

exports.before = {
  create: [
    iff(ifExternal(), setCreatedAt()),
  ],
};
