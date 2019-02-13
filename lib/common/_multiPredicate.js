const runPredicate = require('./_runPredicate');

module.exports = function multiPredicate(checkResults) {
    return function (...rest) {
        return function (...fnArgs) {
            const promises = rest.map(fn => runPredicate(fn, this, fnArgs));

            return Promise.all(promises)
                .then(checkResults);
        };
    };
}