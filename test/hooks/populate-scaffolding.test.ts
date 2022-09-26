import { assert } from 'chai';
import configApp from '../helpers/config-app';

describe('services populate - test scaffolding', () => {
  it('can reinitialize database', (done: any) => {
    const app = configApp(['users', 'comments', 'posts', 'recommendation']);
    const users = app.service('users');

    users
      .find({ query: {} })
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
