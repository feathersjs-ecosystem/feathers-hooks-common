
module.exports = function runHook (extraContent1) {
  const extraContent = extraContent1; // cannot access extraContent1 below. why not?

  return hookFunc => result => {
    const context = Object.assign({}, { type: 'after', params: {}, result }, extraContent);

    if (typeof result === 'object' && result !== null && result.total && result.data) {
      context.method = 'find'; // needed by feathers-hooks-common/lib/service/get-items.js
    }

    return Promise.resolve()
      .then(() => hookFunc(context))
      .then(newContext => {
        if (newContext === undefined) { return; }

        const result = newContext.result;

        if (typeof result === 'object' && result !== null && result.total && result.data) { // find
          return newContext.result;
        }

        return newContext.result.data || newContext.result;
      });
  };
};
