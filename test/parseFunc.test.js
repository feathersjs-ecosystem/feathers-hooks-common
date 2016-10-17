
/* eslint no-param-reassign: 0, no-shadow: 0, no-unused-vars: 0, no-var: 0 */

const assert = require('chai').assert;

const promisify = require('../lib/promisify');

const parseFunc = promisify.parseFunc;
const setCbVarNames = promisify.setCbVarNames;

var cbVarNames = ['cb', 'callback', 'callback_', 'done', 'next'];

/* eslint-disable */

function testFcn(a, b, cb){}

const testHodor = (a, b, c, hodor) => {};

// ensure the parsing ignores the comments
function /* cb, callback ()*/ testStark /* cb, callback ()*/ (
  a /* cb, callback ()*/, /* cb, callback ()*/ b, stark
) /* cb, callback ()*/ {/* cb, callback ()*/};

/* eslint-enable */

describe('parseFunc', () => {
  describe('identifies a callback', () => {
    describe('using default cb var names', () => {
      cbVarNames.forEach(name => {
        it(name, () => {
          assert.deepEqual(
            parseFunc(testFcn),
            [3, false, true]
          );
        });
      });
    });

    it('with only param being the cb', () => {
      assert.deepEqual(
        parseFunc((cb) => {}),
        [1, false, true]
      );
    });
  });

  describe('identifies not a callback', () => {
    it('with no cb var name', () => {
      assert.deepEqual(
        parseFunc(testHodor),
        [4, false, false]
      );
    });

    it('with ..rest', () => {
      assert.deepEqual(
        parseFunc((a, b, c, ...cb) => {}),
        [3, true, false]
      );
    });

    it('with no params', () => {
      assert.deepEqual(
        parseFunc(() => {}),
        [0, false, false]
      );
    });
  });

  /*
  describe('throws if cannot parse function', () => {
    it('throws', () => {
      assert.throws(() => {
        parseFunc(
          (a = () => {}) => {} // cannot parse this properly as of Sept 2016 v0.3.2
        );
      });
    });
  });
  */
});

describe('setCbVarNames', () => {
  beforeEach(() => {
    setCbVarNames(cbVarNames);
  });

  afterEach(() => {
    setCbVarNames(cbVarNames);
  });

  it('add a name', () => {
    setCbVarNames('hodor', true);
    assert.deepEqual(
      parseFunc(testHodor),
      [4, false, true]
    );
  });

  it('add an array', () => {
    setCbVarNames(['targarian', 'stark']);
    assert.deepEqual(
      parseFunc(testStark),
      [3, false, true]
    );
  });

  it('replace by an array', () => {
    setCbVarNames(['targarian', 'stark'], true);
    assert.deepEqual(
      parseFunc(testFcn),
      [3, false, false]
    );

    assert.deepEqual(
      parseFunc(testStark),
      [3, false, true]
    );
  });
});
