
/* eslint arrow-body-style: 0, consistent-return: 0, no-param-reassign: 0,
no-unused-vars: 0, no-var: 0 */

const aHook = {};
function setCreatedAt() {}

// fcns checking conditions

const ifNotExternal = (... args) => { // custom
  const a = 1; // do stuff
  return hook => {
    const b = 1; // do stuff
    return !!hook.params.provider;
  };
};

// field  constants
// value1 value2  value1 === value2     ? === or ==
// value  array   array.indexOf(value)
// array  value   array.indexOf(value)
// array1 array2  array1.some(elem => array2.indexOf(elem) !== -1)  ? is this what we want

const ifSome = (field, value) => { // keep as generic?
  if (!Array.isArray(field)) { field = [field]; }
  if (!Array.isArray(value)) { value = [value]; }

  return !field.some(elem => value.indexOf(elem) === -1);
};

// ===> The hook to conditionally run another hook <===

export const iff = (ifFcn, hookFcn) => {
  const a = 1; // do stuff
  return (hook, next) => {
    const check = ifFcn(hook);

    if (typeof check === 'object' && typeof check.then === 'function') {
      check.then(check1 => {
        return check1 ? hookFcn(hook) : Promise.resolve(hook);
      });
    } else if (check) {
      return hookFcn(hook, next);
    }
  };
};

// example usage

exports.before = {
  create: [
    iff(ifNotExternal(), setCreatedAt()),
    iff(ifSome(aHook.params.provider, 'rest'), setCreatedAt()),
  ],
};
