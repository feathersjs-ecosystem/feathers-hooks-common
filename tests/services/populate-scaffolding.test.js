
const assert = require('assert').strict;
const configApp = require('../helpers/config-app');

describe('services populate - test scaffolding', () => {
  it('can reinitialize database', done => {
    const app = configApp(['users', 'comments', 'posts', 'recommendation']);
    const users = app.service('users');

    users.find({ query: {} })
      .then(data => {
        assert.equal(data.length, 2);
      })
      .then(() => {
        return users.remove(0);
      })
      .then(() => {
        return users.find({ query: {} });
      })
      .then(data => {
        assert.equal(data.length, 1);
      })
      .then(() => {
        const app1 = configApp(['users', 'comments', 'posts', 'recommendation']);
        const users1 = app1.service('users');

        return users1.find({ query: {} });
      })
      .then(data => {
        assert.equal(data.length, 2);
        done();
      });
  });
});
