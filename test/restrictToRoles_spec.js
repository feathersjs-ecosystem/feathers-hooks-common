
/* eslint  no-shadow: 0, no-var: 0 */

const assert = require('chai').assert;
const hooksCommon = require('../lib/index');

var hook;
var authorizer;

describe('restrictToRoles', () => {
  beforeEach(() => {
    authorizer = hooksCommon.restrictToRoles([], 'allowedRoles', false, 'ownerId');
    hook = {
      type: 'before', method: 'create',
      params: {
        provider: 'rest',
        user: { _id: '123', allowedRoles: ['purchasing', 'accounting'] },
      },
      app: {
        get: () => {},
      },
    };
  });

  it('authorizes a single role', () => {
    assert.doesNotThrow(() => {
      authorizer('purchasing')(hook);
    });
  });

  it('authorizes a multiple roles role', () => {
    assert.doesNotThrow(() => {
      authorizer(['purchasing', 'receiving'])(hook);
    });
  });

  it('does not authorize', () => {
    assert.throws(() => {
      authorizer(['ordering', 'engineering'])(hook);
    });
  });
});
