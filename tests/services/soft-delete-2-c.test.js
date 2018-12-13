
const assert = require('chai').assert;

const authentication = require('@feathersjs/authentication');
const express = require('@feathersjs/express');
const feathers = require('@feathersjs/feathers');
const feathersClient = require('@feathersjs/client');
const httpShutdown = require('http-shutdown');
const io = require('socket.io-client');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const memory = require('feathers-memory');
const socketio = require('@feathersjs/socketio');

const { restrictToOwner } = require('feathers-authentication-hooks');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
const { softDelete2, paramsForServer, paramsFromClient } = require('../../lib/services');

const ioOptions = {
  transports: ['websocket'],
  forceNew: true,
  reconnection: false
};
const deletedMessage = 'Record not found, is logically deleted.';
const restrictToOwnerMessage = 'You do not have the permissions to access this.';
let restrictCalls = [];

const usersDB = [ // Note that deletedAt is set to -1 upon users.create()
  { id: 0, email: 'feathersjs@gmail.com', password: 'hooks-common' },
  { id: 1, email: 'react@gmail.com', password: 'redux' }, // deleted during init
  { id: 2, email: 'vuet@gmail.com', password: 'vuex' }
];

const postsDB = [ // Note that deletedAt is set to -1 upon posts.create()
  { id: 0, subject: 'post 0', ownerId: 0 },
  { id: 1, subject: 'post 1', ownerId: 0 }, // deleted during init
  { id: 2, subject: 'post 2', ownerId: 2 },
  { id: 3, subject: 'post 3', ownerId: 2 } // deleted during remove test
];

describe('services softDelete2-c', () => {
  describe('test client/server interaction without authentication', () => {
    let app;
    let server;
    let users;

    let appClient;
    let usersClient;

    beforeEach(done => {
      // configure server
      ({ app, server } = makeServerNoAuth());
      users = app.service('users');
      server.on('listening', () => done());

      // configure client
      appClient = makeClientNoAuth();
      usersClient = appClient.service('users');
    });

    afterEach(done => {
      server.shutdown(() => {
        done();
      });
    });

    async function testConnection () {
      users.hooks({
        before: {
          all: softDelete2()
        },
        after: {
          all: softDelete2()
        }
      });

      // init DB
      await users.remove(null, { $ignoreDeletedAt: true });
      await users.create(clone(usersDB));

      // do successful client call
      const rec1 = await usersClient.get(0);
      assert.deepEqual(rec1, {
        id: 0, email: 'feathersjs@gmail.com', password: 'hooks-common', deletedAt: -1
      }, 'unexpected data');

      // do client call which throws
      try {
        await usersClient.get(999);
      } catch (err) {
        return;
      }
      assert.isOk(false, 'successful: unexpectedly read record');
    }

    it('test success & fail on initial connection', testConnection);

    it('test success & fail on another connection', testConnection);
  });

  describe('test client/server interaction with authentication', function () {
    this.timeout(50000);

    let app;
    let server;
    let users;
    let posts;

    let appClient;
    let usersClient;
    let postsClient;

    before(async function () {
      // configure server
      ({ app, server } = makeServerAuth());
      users = app.service('users');
      posts = app.service('posts');
      server.on('listening', () => {
        console.log('Listening');
      });

      // configure client
      appClient = makeClientAuth();
      usersClient = appClient.service('users');
      postsClient = appClient.service('posts');

      // configure authentication
      users.hooks({
        before: {
          all: [],
          find: [ authenticate('jwt'), softDelete2() ],
          get: [ authenticate('jwt'), softDelete2() ],
          create: [ hashPassword(), authenticate('jwt'), softDelete2() ],
          update: [ hashPassword(), authenticate('jwt'), softDelete2() ],
          patch: [ hashPassword(), authenticate('jwt'), softDelete2() ],
          remove: [ authenticate('jwt'), softDelete2() ]
        },
        after: {
          all: [ protect('password'), softDelete2() ] /* Must always be the last 2 hooks */
        },
        error: {}
      });

      posts.hooks({
        before: {
          all: [ paramsFromClient('$ignoreDeletedAt'), authenticate('jwt') ],
          get: [ softDelete2(), restrict('get') ],
          create: [ softDelete2(), restrict('create') ],
          update: [ softDelete2(), restrict('update') ],
          patch: [ softDelete2(), restrict('patch') ],
          remove: [ restrict('remove'), softDelete2() ]
        },
        after: {
          all: softDelete2()
        },
        error: {}
      });

      // init users DB
      await users.remove(null, { $ignoreDeletedAt: true });
      await users.create(clone(usersDB));
      let rec = await users.remove(1);
      assert.isAtLeast(rec.deletedAt, 0); // ensure record is now logically deleted

      // init posts DB
      await posts.remove(null, { $ignoreDeletedAt: true });
      await posts.create(clone(postsDB));
      rec = await posts.remove(1);
      assert.isAtLeast(rec.deletedAt, 0); // ensure record is now logically deleted

      // login as user id = 0
      await login(appClient, 'feathersjs@gmail.com', 'hooks-common');
    });

    after(function (done) {
      server.shutdown(() => { done(); });
    });

    describe('Test client calls on user-entity', () => {
      describe('Test get', () => {
        it('Can do successful client get call on user-entity', async () => {
          const rec1 = await usersClient.get(0);

          assert.deepEqual(rec1, {
            id: 0, email: 'feathersjs@gmail.com', deletedAt: -1
          }, 'successful: unexpected user-entity data');
        });

        it('Can do client get call on user-entity which throws', async () => {
          try {
            await usersClient.get(1);
          } catch (err) {
            return;
          }
          assert.isOk(false, 'unsuccessful: unexpectedly read user-entity record');
        });
      });
    });

    describe('Test client calls on service', () => {
      beforeEach(() => {
        restrictCalls = [];
      });

      describe('Test get', () => {
        it('Can do successful client get call on service', async () => {
          const rec1 = await postsClient.get(0);

          assert.deepEqual(rec1, {
            id: 0, subject: 'post 0', ownerId: 0, deletedAt: -1
          }, 'successful: unexpected service data');
          assert.deepEqual(restrictCalls, [
            ['get', 'before', 'get', undefined], // restrictToOwner hook for original service call
            ['get', 'before', 'get', undefined] // restrictToOwner hook for get call made by restrictToOwner
          ]);
        });

        it('Can do client get call on service which throws due to deleted record', async () => {
          try {
            await postsClient.get(1);
          } catch (err) {
            assert.equal(err.message, deletedMessage, 'unexpected error');
            assert.deepEqual(restrictCalls, []);
            return;
          }
          assert.isOk(false, 'unsuccessful: unexpectedly read service record');
        });

        it('Can do client get call on service which throws due to restrictToOwner', async () => {
          try {
            await postsClient.get(2);
          } catch (err) {
            assert.deepEqual(restrictCalls, [
              ['get', 'before', 'get', undefined], // restrictToOwner hook for original service call
              ['get', 'before', 'get', undefined] // restrictToOwner hook for get call made by restrictToOwner
            ]);
            return;
          }
          assert.isOk(false, 'unsuccessful: unexpectedly read service record');
        });

        it('Can use $ignoreDeletedAt', async () => {
          const rec1 = await postsClient.get(1, paramsForServer({ $ignoreDeletedAt: true }));

          assert.isAtLeast(rec1.deletedAt, 0);
          delete rec1.deletedAt;

          assert.deepEqual(rec1, {
            id: 1, subject: 'post 1', ownerId: 0
          }, 'successful: unexpected service data');
          assert.deepEqual(restrictCalls, [
            ['get', 'before', 'get', undefined], // restrictToOwner hook for original service call
            ['get', 'before', 'get', undefined] // restrictToOwner hook for get call made by restrictToOwner
          ], 'unexpected restrictedCalls');
        });
      });

      describe('Test patch', () => {
        it('Can do successful client get call on service', async () => {
          const rec1 = await postsClient.patch(0, { a: 'a' });

          assert.deepEqual(rec1, {
            id: 0, subject: 'post 0', ownerId: 0, deletedAt: -1, a: 'a'
          }, 'successful: unexpected service data');
          assert.deepEqual(restrictCalls, [
            ['patch', 'before', 'patch', undefined], // restrictToOwner hook for original service call
            ['get', 'before', 'get', undefined] // restrictToOwner hook for get call made by restrictToOwner
          ]);
        });

        it('Can do client get call on service which throws due to deleted record', async () => {
          try {
            await postsClient.patch(1, { b: 'b' });
          } catch (err) {
            assert.equal(err.message, deletedMessage, 'unexpected error');
            assert.deepEqual(restrictCalls, []);
            return;
          }
          assert.isOk(false, 'unsuccessful: unexpectedly read service record');
        });

        it('Can do client get call on service which throws due to restrictToOwner', async () => {
          try {
            await postsClient.patch(2, { b: 'b' });
          } catch (err) {
            assert.deepEqual(restrictCalls, [
              ['patch', 'before', 'patch', undefined], // restrictToOwner hook for original service call
              ['get', 'before', 'get', undefined] // restrictToOwner hook for get call made by restrictToOwner
            ]);
            return;
          }
          assert.isOk(false, 'unsuccessful: unexpectedly read service record');
        });

        it('Can use $ignoreDeletedAt', async () => {
          const rec1 = await postsClient.patch(1, { b: 'b' }, paramsForServer({ $ignoreDeletedAt: true }));

          assert.isAtLeast(rec1.deletedAt, 0);
          delete rec1.deletedAt;

          assert.deepEqual(rec1, {
            id: 1, subject: 'post 1', ownerId: 0, b: 'b'
          }, 'successful: unexpected service data');
          assert.deepEqual(restrictCalls, [
            ['patch', 'before', 'patch', undefined], // restrictToOwner hook for original service call
            ['get', 'before', 'get', undefined] // restrictToOwner hook for get call made by restrictToOwner
          ], 'unexpected restrictedCalls');
        });
      });

      describe('Test remove', () => {
        it('Can remove active record', async () => {
          const data = await postsClient.remove(0);

          const dataReturned = clone(data);
          const data1 = clone(data);
          delete data1.deletedAt;

          assert.deepEqual(data1, {
            id: 0, subject: 'post 0', ownerId: 0, a: 'a'
          }, 'unexpected data');
          assert.isAtLeast(data.deletedAt, 0);
          assert.deepEqual(restrictCalls, [
            ['remove', 'before', 'remove', undefined], // restrictToOwner hook for original service call
            ['get', 'before', 'get', undefined] // restrictToOwner hook for get call made by restrictToOwner
          ]);

          const rec = await posts.get(0, { $ignoreDeletedAt: true });
          assert.deepEqual(rec, dataReturned, 'unexpected data');
        });

        it('Can throw on inactive record', async () => {
          try {
            await postsClient.remove(1);
            assert(false, 'data returned unexpectedly');
          } catch (err) {
            assert.equal(err.message, deletedMessage, 'unexpected error');
            assert.deepEqual(restrictCalls, [
              ['remove', 'before', 'remove', undefined] // restrictToOwner hook for original service call
            ], 'unexpected restrictedCalls');
          }
        });

        it('Can throw due to restrictToOwner', async () => {
          try {
            await postsClient.remove(2);
            assert(false, 'data returned unexpectedly');
          } catch (err) {
            assert.equal(err.message, restrictToOwnerMessage, 'unexpected error');
            assert.deepEqual(restrictCalls, [
              ['remove', 'before', 'remove', undefined], // restrictToOwner hook for original service call
              ['get', 'before', 'get', undefined] // restrictToOwner hook for get call made by restrictToOwner
            ], 'unexpected restrictedCalls');
          }
        });

        it('Can use $ignoreDeletedAt', async () => {
          const rec1 = await postsClient.remove(1, paramsForServer({ $ignoreDeletedAt: true }));

          assert.isAtLeast(rec1.deletedAt, 0); // ensure record is still logically deleted
          delete rec1.deletedAt;

          assert.deepEqual(rec1, {
            id: 1, subject: 'post 1', ownerId: 0, b: 'b'
          }, 'successful: unexpected service data');
          assert.deepEqual(restrictCalls, [
            ['remove', 'before', 'remove', undefined], // restrictToOwner hook for original service call
            ['get', 'before', 'get', undefined] // restrictToOwner hook for get call made by restrictToOwner
          ], 'unexpected restrictedCalls');
        });
      });
    });

    function restrict (where) {
      return context => {
        restrictCalls.push([where, context.type, context.method, context.params.$disableSoftDelete2]);

        return restrictToOwner({ idField: 'id', ownerField: 'ownerId' })(context);
      };
    }
  });
});

function makeServerNoAuth () {
  const app = express(feathers());
  app.configure(socketio());
  app.configure(services);
  app.use(express.notFound());
  app.use(express.errorHandler({}));
  app.hooks({
    before: {}, after: {}, error: {}
  });

  let server = app.listen(3030);
  server = httpShutdown(server); // add better shutdown functionality

  return { app, server };

  function services () {
    const app = this;
    app.configure(users);
  }

  function users () {
    const app = this;
    app.use('/users', memory());
    // app.service('users').hooks({});
  }
}

function makeClientNoAuth () {
  const appClient = feathersClient();
  appClient.configure(feathersClient.socketio(io('http://localhost:3030', ioOptions)));

  return appClient;
}

function makeServerAuth () {
  const app = express(feathers());
  app.configure(socketio());
  app.configure(makeAuthentication);
  app.configure(services);
  app.use(express.notFound());
  app.use(express.errorHandler({}));
  app.hooks({
    before: {}, after: {}, error: {}
  });

  let server = app.listen(3030);
  server = httpShutdown(server); // add better shutdown functionality

  return { app, server };

  function makeAuthentication (app) {
    const config = {
      'secret': '2b9bd948c19419db5f0b65403adeaa1d1c2c162a83cab1a699d3d030ad50b86f120cffd62b76530e312211b11d87147f64ae50b0c9c89477b3af421461a7d7ebf524ce3ec0ebf027e34ae245dde947e2cb8817b039291b74d5943f894b2f6fd8b4917b8ae039bbf7b2e9fca1907787fd7332c86e3c15b26afaec0d9dc54a65b527191fc7c6d61b753c3916b2a5baa1360f19099f1b67a3e4cfd23c795f41f8aec6109b4b6a27bc3a0b76b095fdd2185c9328078d190c26b98de1137c145c900cdfbbd9d3e5e79bf597a6ef4b631fd59ecfa90d49078f0419885c9bfc92c66f4a0166d1e7564ae07dc976c6f6151dc6f3d4b40ad2f2751165c7b15379bdda49b7',
      'strategies': [
        'jwt',
        'local'
      ],
      'path': '/authentication',
      'service': 'users',
      'jwt': {
        'header': {
          'typ': 'access'
        },
        'audience': 'https://yourdomain.com',
        'subject': 'anonymous',
        'issuer': 'feathers',
        'algorithm': 'HS256',
        'expiresIn': '1d'
      },
      'local': {
        'entity': 'user',
        'usernameField': 'email',
        'passwordField': 'password'
      }
    };

    app.configure(authentication(config));
    app.configure(jwt());
    app.configure(local());

    app.service('authentication').hooks({
      before: {
        create: [
          authentication.hooks.authenticate(config.strategies)
        ],
        remove: [
          authentication.hooks.authenticate('jwt')
        ]
      }
    });
  }

  function services () {
    const app = this;
    app.configure(users);
    app.configure(posts);
  }

  function users () {
    const app = this;
    app.use('/users', memory());
    // app.service('users').hooks({});
  }

  function posts () {
    const app = this;
    app.use('/posts', memory());
    // app.service('posts').hooks({});
  }
}

function makeClientAuth () {
  const appClient = feathersClient();
  appClient.configure(feathersClient.socketio(io('http://localhost:3030', ioOptions)));
  appClient.configure(feathersClient.authentication({
    storage: localStorage()
  }));

  return appClient;
}

async function login (appClient, email, password) {
  try {
    await appClient.authenticate({
      strategy: 'local',
      email,
      password
    });
  } catch (err) {
    console.log(`login error: ${err.message}`);
    throw err;
  }
}

function localStorage () {
  const store = {};

  return {
    setItem (key, value) {
      store[key] = value;
    },
    getItem (key) {
      return store[key];
    },
    removeItem (key) {
      delete store[key];
    }
  };
}

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
