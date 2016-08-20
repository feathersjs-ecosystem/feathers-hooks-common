
/* eslint no-param-reassign: 0, no-unused-vars: 0, no-var: 0 */

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
  if (!Array.isArray(field)) { field = [field]; } // need to clone
  if (!Array.isArray(value)) { value = [value]; } // need to clone

  return !field.some(elem => value.indexOf(elem) === -1);
};

// The hook to conditionally run another hook

export const iff = (ifFcn, hookFcn) => {
  const a = 1; // do stuff
  return (hook, next) => {
    if (ifFcn(hook)) { // Do we want to use a clone of hook? Doubtful.
      return hookFcn(hook, next);
    }

    return hook;
  };
};

// example usage

exports.before = {
  create: [
    iff(ifNotExternal(), setCreatedAt()),
    iff(ifSome(aHook.params.provider, 'rest'), setCreatedAt()),
  ],
};
