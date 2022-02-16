
const { assert } = require('chai');
const { required } = require('../../lib/services');

let hookBefore;

describe('services required', () => {
  beforeEach(() => {
    hookBefore = {
      type: 'before',
      method: 'create',
      params: { provider: 'rest' },
      data: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
    };
  });

  it('does 1 prop with no dots', () => {
    required('empl')(hookBefore);
  });

  it('does multi props with 1 dot', () => {
    required('empl.name', 'dept')(hookBefore);
  });

  it('does multi props with 2 dots', () => {
    required('empl.name.last', 'empl.status', 'dept')(hookBefore);
  });

  it('throws on bad or missing paths', () => {
    assert.throws(() => required('empl.name.first', 'empl.name.surname')(hookBefore));
  });

  it('ignores bad or missing no dot path', () => {
    assert.throws(() => required('xx')(hookBefore));
  });
});
