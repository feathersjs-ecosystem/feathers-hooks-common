
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const assert = require('assert').strict;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'configApp'... Remove this comment to see the full error message
const configApp = require('../helpers/config-app');

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services populate - test scaffolding', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('can reinitialize database', (done: any) => {
    const app = configApp(['users', 'comments', 'posts', 'recommendation']);
    const users = app.service('users');

    users.find({ query: {} })
      .then((data: any) => {
        assert.equal(data.length, 2);
      })
      .then(() => {
        return users.remove(0);
      })
      .then(() => {
        return users.find({ query: {} });
      })
      .then((data: any) => {
        assert.equal(data.length, 1);
      })
      .then(() => {
        const app1 = configApp(['users', 'comments', 'posts', 'recommendation']);
        const users1 = app1.service('users');

        return users1.find({ query: {} });
      })
      .then((data: any) => {
        assert.equal(data.length, 2);
        done();
      });
  });
});
