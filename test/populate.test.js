if (!global._babelPolyfill) { require('babel-polyfill'); }

import { assert } from 'chai';
import hooks from '../src';
import feathersFakes from 'feathers-tests-fake-app-users';

const fakeUsersDb = [ // faked in-memory database
  { _id: 'a', name: 'John Doe', isVerified: false, password: 'secret' },
  { _id: 'b', name: 'Jane Doe', isVerified: true, password: 'secret' }
];
const fakeMessagesDb = [ // faked in-memory database
  { _id: '1', senderId: 'a', text: 'Jane, are you there?' },
  { _id: '2', senderId: 'b', text: 'I am. How are you?' },
  { _id: '3', senderId: 'a', text: 'Fine, and you?' },
  { _id: '4', senderId: 'b', text: 'Fine too?' }
];

describe('populate', () => {
  var usersDb;
  var messagesDb;
  var app;
  var hookA;
  var hookMulti;
  var hookBad;
  var hookNonPaginated;
  var hookPaginated;

  beforeEach(() => {
    usersDb = clone(fakeUsersDb);
    messagesDb = clone(fakeMessagesDb);
    app = feathersFakes.app(); // stub feathers app
    const usersService = feathersFakes.makeDbService(app, 'users', usersDb);
    const messagesService = feathersFakes.makeDbService(app, 'messages', messagesDb);
    app.use('/users', usersService);
    app.use('/messages', messagesService);

    // Emulate a remove('password') after hook on /users
    const usersGet = app.service('/users').get;
    app.service('/users').get = (id, params) => {
      return usersGet(id, params).then(user => {
        if (user && !!params.provider) {
          delete user.password;
        }
        return user;
      });
    };

    hookA = {
      type: 'after',
      method: 'create',
      app,
      result: { _id: '5', senderId: 'a', text: 'I\'m eating an ice cream.' }
    };
    hookMulti = {
      type: 'after',
      method: 'create',
      app,
      result: { _id: '5', senderId: ['a', 'b'], text: 'I\'m eating an ice cream.' }
    };
    hookNonPaginated = {
      type: 'after',
      method: 'create',
      app,
      result: [
        { _id: '1', senderId: 'a', text: 'Jane, are you there?' },
        { _id: '2', senderId: 'b', text: 'I am. How are you?' }
      ]
    };
    hookPaginated = {
      type: 'after',
      method: 'find',
      app,
      result: { data: [
        { _id: '1', senderId: 'a', text: 'Jane, are you there?' },
        { _id: '2', senderId: 'b', text: 'I am. How are you?' }
      ] }
    };
    hookBad = {
      type: 'after',
      method: 'create',
      app,
      result: { _id: '5', senderId: 'no-suc-id', text: 'I\'m eating an ice cream.' }
    };
  });

  describe('test fakes', () => {
    it('fakes built correctly', () => {
      const users = app.service('/users');
      const messages = app.service('/messages');
      assert.isFunction(users.create);
      assert.isFunction(messages.find);
    });

    it('finds items correctly', (next) => {
      const messages = app.service('/messages');
      messages.find({ query: { senderId: 'a' } }).then(result => {
        const data = result.data;
        assert.equal(data.length, 2);
        next();
      });
    });
  });

  describe('uses options.field as key, target for populated fields', () => {
    it('populates an item with another which exists', (next) => {
      hooks.populate('user', { field: 'senderId', service: '/users' })(hookA)
        .then(hook => {
          assert.deepEqual(hook.result, {
            _id: '5',
            senderId: 'a',
            text: 'I\'m eating an ice cream.',
            user: { _id: 'a', name: 'John Doe', isVerified: false, password: 'secret' }
          });
          next();
        })
        .catch(err => {
          console.log('unexpectedly failed.');
          console.log(err);
        });
    });
    it('does not populate an item with another that does not exist', (next) => {
      hooks.populate('user', { field: 'senderId', service: '/users' })(hookBad)
        .then(hook => {
          console.log('unexpectedly succeeded.');
        })
        .catch(() => {
          next();
        });
    });
  });

  describe('target is default for option.field', () => {
    it('populates an item with another which exists', (next) => {
      hooks.populate('senderId', { service: '/users' })(hookA)
        .then(hook => {
          assert.deepEqual(hook.result, {
            _id: '5',
            senderId: { _id: 'a', name: 'John Doe', isVerified: false, password: 'secret' },
            text: 'I\'m eating an ice cream.'
          });
          next();
        })
        .catch(err => {
          console.log('unexpectedly failed.');
          console.log(err.message);
        });
    });
    it('does not populate an item with another that does not exist', (next) => {
      hooks.populate('senderId', { service: '/users' })(hookBad)
        .then(hook => {
          console.log('unexpectedly succeeded.');
        })
        .catch(() => {
          next();
        });
    });
  });

  describe('populates an array of results', () => {
    it('non-paginated for any method', (next) => {
      hooks.populate('user', { field: 'senderId', service: '/users' })(hookNonPaginated)
        .then(hook => {
          assert.deepEqual(hook.result, [
            { _id: '1',
              senderId: 'a',
              text: 'Jane, are you there?',
              user: { _id: 'a', name: 'John Doe', isVerified: false, password: 'secret' } },
            { _id: '2',
              senderId: 'b',
              text: 'I am. How are you?',
              user: { _id: 'b', name: 'Jane Doe', isVerified: true, password: 'secret' } }
          ]);
          next();
        })
        .catch(err => {
          console.log('unexpectedly failed.');
          console.log(err);
        });
    });

    it('paginated if necessary for find method', (next) => {
      hooks.populate('user', { field: 'senderId', service: '/users' })(hookPaginated)
        .then(hook => {
          assert.deepEqual(hook.result, { data: [
            { _id: '1',
              senderId: 'a',
              text: 'Jane, are you there?',
              user: { _id: 'a', name: 'John Doe', isVerified: false, password: 'secret' } },
            { _id: '2',
              senderId: 'b',
              text: 'I am. How are you?',
              user: { _id: 'b', name: 'Jane Doe', isVerified: true, password: 'secret' } }
          ] });
          next();
        })
        .catch(err => {
          console.log('unexpectedly failed.');
          console.log(err);
        });
    });
  });

  describe('populates with multiple ids', () => {
    it('in one item', (next) => {
      hooks.populate('user', { field: 'senderId', service: '/users' })(hookMulti)
        .then(hook => {
          assert.deepEqual(hook.result, {
            _id: '5',
            senderId: ['a', 'b'],
            text: 'I\'m eating an ice cream.',
            user: [
              { _id: 'a', name: 'John Doe', isVerified: false, password: 'secret' },
              { _id: 'b', name: 'Jane Doe', isVerified: true, password: 'secret' }
            ]
          });
          next();
        })
        .catch(err => {
          console.log('unexpectedly failed.');
          console.log(err);
        });
    });
  });

  describe('populates depending on provider', () => {
    it('does remove password if non-internal provider', (next) => {
      hookA.params = { provider: 'rest' };
      hooks.populate('user', { field: 'senderId', service: '/users' })(hookA)
        .then(hook => {
          assert.deepEqual(hook.result, {
            _id: '5',
            senderId: 'a',
            text: 'I\'m eating an ice cream.',
            user: { _id: 'a', name: 'John Doe', isVerified: false }
          });
          next();
        })
        .catch(err => {
          console.log('unexpectedly failed.');
          console.log(err);
        });
    });
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
