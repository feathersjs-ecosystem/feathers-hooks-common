const { assert } = require('chai');
const { preventUpdateChanges } = require('../../lib/services');

let hookBefore;

const validate = (promise) => () => promise
  .then(() => { throw new Error('Promise did not throw'); })
  .catch((error) => {
    if (error.message.match(/^Field [a-z.]+ may not be changed\. \(preventUpdateChanges\)$/)) return Promise.resolve();
    else throw error;
  });

describe('services preventUpdateChanges', () => {
  describe('allowed for before update', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'update',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' } };
    });

    it('does not throw on before update', () => {
      preventUpdateChanges(() => ({ first: 'John' }), true, 'first')(hookBefore);
    });

    ['before', 'after'].forEach(type => {
      ['find', 'get', 'create', 'update', 'patch', 'remove'].forEach(method => {
        if (type !== 'before' || method !== 'update') {
          it(`throws on ${type} ${method}`, () => {
            hookBefore.type = type;
            hookBefore.method = method;
            assert.throws(() => preventUpdateChanges(() => ({ first: 'John' }), true, 'first')(hookBefore));
          });
        }
      });
    });
  });

  describe('is configurable', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'update',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe', a: { b: undefined, c: { d: { e: 1 } } } } };
    });

    it('use default getter function', (done) => {
      hookBefore.id = 1;
      hookBefore.service = { get: () => ({ first: 'Bill', last: 'Gates' }) };

      Promise.resolve()
        .then(validate(preventUpdateChanges(undefined, true, 'first')(hookBefore)))
        .then(() => done())
        // test fails if any function call above didn't throw or an unexpected error occured
        .catch((error) => done(error));
    });

    it('throw when "ifThrow" is set to "true"', (done) => {
      Promise.resolve()
        .then(validate(preventUpdateChanges(() => ({ first: 'Bill', last: 'Gates' }), true, 'first')(hookBefore)))
        .then(() => done())
        // test fails if any function call above didn't throw or an unexpected error occured
        .catch((error) => done(error));
    });

    it('replace when "ifThrow" is set to "false"', (done) => {
      Promise.resolve()
        .then(() => preventUpdateChanges(() => ({ first: 'Bill', last: 'Gates' }), false, 'first')(hookBefore))
        .then((context) => {
          assert.deepEqual(context.data,
            { first: 'Bill', last: 'Doe', a: { b: undefined, c: { d: { e: 1 } } } },
            '3');
          done();
        })
        .catch((error) => done(error));
    });
  });

  describe('throws on violation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'update',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe', a: { b: undefined, c: { d: { e: 1 } } } } };
    });

    it('does not throw if no restricted fields changed', (done) => {
      const testNesting = () => ({ first: 'John', last: 'Doe', a: { b: undefined, c: { d: { e: 1 } } } });

      Promise.resolve()
        .then(() => preventUpdateChanges(() => ({ first: 'John', last: 'Doe' }), true, 'first')(hookBefore))
        .then(() => preventUpdateChanges(() => ({ first: 'John', last: 'Jobs' }), true, 'first')(hookBefore))
        .then(() => preventUpdateChanges(testNesting, true, 'a')(hookBefore))
        .then(() => preventUpdateChanges(testNesting, true, 'a.b')(hookBefore))
        .then(() => preventUpdateChanges(testNesting, true, 'a.c')(hookBefore))
        .then(() => preventUpdateChanges(testNesting, true, 'a.c.d.e')(hookBefore))
        .then(() => done())
        .catch(error => done(error));
    });

    it('throw if restricted fields change', (done) => {
      const testNesting = () => ({ first: 'John', last: 'Doe', a: { b: 1, c: { d: { e: 2 } } } });

      Promise.resolve()
        .then(validate(preventUpdateChanges(() => ({ first: 'Steve', last: 'Doe' }), true, 'first')(hookBefore)))
        .then(validate(preventUpdateChanges(() => ({ first: 'Steve', last: 'Jobs' }), true, 'first')(hookBefore)))
        .then(validate(preventUpdateChanges(testNesting, true, 'a')(hookBefore)))
        .then(validate(preventUpdateChanges(testNesting, true, 'a.b')(hookBefore)))
        .then(validate(preventUpdateChanges(testNesting, true, 'a.c')(hookBefore)))
        .then(validate(preventUpdateChanges(testNesting, true, 'a.c.d.e')(hookBefore)))
        .then(() => done())
        // test fails if any function call above didn't throw or an unexpected error occured
        .catch((error) => done(error));
    });
  });
});
