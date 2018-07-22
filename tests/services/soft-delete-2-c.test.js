
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

const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
const { softDelete2 } = require('../../lib/services');

const ioOptions = {
  transports: ['websocket'],
  forceNew: true,
  reconnection: false
};

const usersDB = [ // Note that deletedAt is set to -1 upon users.create()
  { id: 0, email: 'feathersjs@gmail.com', password: 'hooks-common' },
  { id: 1, email: 'react@gmail.com', password: 'redux' }
];

const postsDB = [ // Note that deletedAt is set to -1 upon posts.create()
  { id: 0, subject: 'post 0' },
  { id: 1, subject: 'post 1' }
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
    this.timeout(15000);

    let app;
    let server;
    let users;
    let posts;

    let appClient;
    let usersClient;
    let postsClient;

    beforeEach(function (done) {
      // configure server
      ({ app, server } = makeServerAuth());
      users = app.service('users');
      posts = app.service('posts');
      server.on('listening', () => done());

      // configure client
      appClient = makeClientAuth();
      usersClient = appClient.service('users');
      postsClient = appClient.service('posts');
    });

    afterEach(function (done) {
      server.shutdown(() => { done(); });
    });

    // We're testing a few things at once to save the time required to login for each separately.
    async function testConnection () {
      users.hooks({
        before: {
          all: [],
          find: [ softDelete2(), authenticate('jwt') ],
          get: [ softDelete2(), authenticate('jwt') ],
          create: [ softDelete2(), hashPassword() ],
          update: [ softDelete2(), hashPassword(), authenticate('jwt') ],
          patch: [ softDelete2(), hashPassword(), authenticate('jwt') ],
          remove: [ authenticate('jwt'), softDelete2() ]
        },
        after: {
          all: [ protect('password'), softDelete2() ] /* Must always be the last 2 hooks */
        },
        error: {}
      });

      posts.hooks({
        before: {
          all: [ softDelete2(), authenticate('jwt') ]
        },
        after: {},
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

      // log in
      await login(appClient, 'feathersjs@gmail.com', 'hooks-common');

      // do successful client call on user-entity
      let rec1 = await usersClient.get(0);
      assert.deepEqual(rec1, {
        id: 0, email: 'feathersjs@gmail.com', deletedAt: -1
      }, 'successful: unexpected user-entity data');

      // do client call on user-entity which throws
      try {
        const rec2 = await usersClient.get(1);
        console.log(rec2);
      } catch (err) {
        return;
      }
      assert.isOk(false, 'unsuccessful: unexpectedly read user-entity record');

      // do successful client call on service
      rec1 = await postsClient.get(0);
      assert.deepEqual(rec1, {
        id: 0, subject: 'post 0', deletedAt: -1
      }, 'successful: unexpected service data');

      // do client call on user-entity which throws
      try {
        const rec2 = await postsClient.get(1);
        console.log(rec2);
      } catch (err) {
        return;
      }
      assert.isOk(false, 'unsuccessful: unexpectedly read service record');
    }

    it('test user-entity & normal service', testConnection);
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
