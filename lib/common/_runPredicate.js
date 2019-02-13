

module.exports = function (predicate, that, args) {
    const isFunction = typeof predicate === 'function'
    return Promise.resolve(isFunction ? predicate.apply(that, args) : !!predicate)
}