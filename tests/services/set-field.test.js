const assert = require('assert').strict;
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const { setField } = require('../../lib/services');

describe('setField', () => {
  const user = {
    id: 1,
    name: 'David'
  };

  let app;

  beforeEach(async () => {
    app = feathers();
    app.use('/messages', memory());
    app.service('messages').hooks({
      before: {
        all: [setField({
          from: 'params.user.id',
          as: 'params.query.userId'
        })]
      }
    });
    await app.service('messages').create({
      id: 1,
      text: 'Message 1',
      userId: 1
    });
    await app.service('messages').create({
      id: 2,
      text: 'Message 2',
      userId: 2
    });
  });

  it('errors when options not set', () => {
    assert.throws(() => app.service('messages').hooks({
      before: {
        get: setField()
      }
    }));
    assert.throws(() => app.service('messages').hooks({
      before: {
        get: setField({ as: 'me' })
      }
    }));
    assert.throws(() => app.service('messages').hooks({
      before: {
        get: setField({ from: 'you' })
      }
    }));
  });

  it('errors when used with wrong app version', async () => {
    app.version = '3.2.1';

    await assert.rejects(async () => {
      await app.service('messages').get('testing');
    }, {
      message: 'The \'setField\' hook only works with Feathers 4 and the latest database adapters'
    });
  });

  it('find queries with user information, does not modify original objects', async () => {
    const query = {};
    const results = await app.service('messages').find({ query, user });

    assert.equal(results.length, 1);
    assert.deepEqual(query, {});
  });

  it('adds user information to get, throws NotFound event if record exists', async () => {
    await assert.rejects(async () => {
      await app.service('messages').get(2, { user });
    }, {
      name: 'NotFound',
      message: 'No record found for id \'2\''
    });

    const result = await app.service('messages').get(1, { user });

    assert.deepEqual(result, {
      id: 1,
      text: 'Message 1',
      userId: 1
    });
  });

  it('does nothing on internal calls if value does not exists', async () => {
    const results = await app.service('messages').find();

    assert.equal(results.length, 2);
  });

  it('errors on external calls if value does not exists', async () => {
    await assert.rejects(async () => {
      await app.service('messages').find({
        provider: 'rest'
      });
    }, {
      name: 'Forbidden',
      message: 'Expected field params.query.userId not available'
    });
  });

  it('errors when not used as a before hook', async () => {
    app.service('messages').hooks({
      after: {
        get: setField({
          from: 'params.user.id',
          as: 'params.query.userId'
        })
      }
    });

    await assert.rejects(async () => {
      await app.service('messages').get(1);
    }, {
      message: 'The \'setField\' hook can only be used as a \'before\' hook.'
    });
  });
});
