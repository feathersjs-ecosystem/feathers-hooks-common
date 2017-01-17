
const assert = require('chai').assert;
const feathers = require('feathers');
const memory = require('feathers-memory');
const feathersHooks = require('feathers-hooks');
const { populate } = require('../../src/services');

const userId = 6;
const userInit = {
  '0': { name: 'Jane Doe', key: 'a', id: 0 },
  '1': { name: 'Jack Doe', key: 'a', id: 1 },
  '2': { name: 'Jack Doe', key: 'a', id: 2, deleted: true },
  '3': { name: 'Rick Doe', key: 'b', id: 3 },
  '4': { name: 'Dick Doe', key: 'b', id: 4 },
  '5': { name: 'Dick Doe', key: 'b', id: 5, deleted: true }
};
const teamId = 2;
const teamInit = {
  '0': { team: 'Does', memberIds: [0, 1, 2], id: 0 },
  '1': { team: 'Dragons', memberIds: [3, 4, 5], id: 1 }
};

const schema = {
  include: [{
    service: 'users',
    nameAs: 'members',
    parentField: 'memberIds',
    childField: 'id'
  }]
};

let userHookFlag1;

function services () {
  const app = this;
  app.configure(user);
  app.configure(team);
}

function user () {
  const app = this;

  app.use('/users', memory({
    store: clone(userInit),
    startId: userId
  }));

  app.service('users').before({
    all: [
      hook => { userHookFlag1 = hook.params.userHookFlag1; }
    ]
  });
}

function team () {
  const app = this;

  app.use('/teams', memory({
    store: clone(teamInit),
    startId: teamId
  }));

  app.service('teams').after({
    all: [populate({ schema })]
  });
}

describe('populate - hook.params passed to includes', () => {
  let app;
  let teams;

  beforeEach(() => {
    app = feathers()
      .configure(feathersHooks())
      .configure(services);
    teams = app.service('teams');
    userHookFlag1 = null;
  });

  it('hook.params passed to includes', () => {
    return teams.find({ query: { id: 0 }, userHookFlag1: 'userHookFlag1' })
      .then(result => {
        assert.equal(userHookFlag1, 'userHookFlag1');
        assert.deepEqual(result, [{
          team: 'Does',
          memberIds: [ 0, 1, 2 ],
          id: 0,
          _include: [ 'members' ],
          members: [
            { name: 'Jane Doe', key: 'a', id: 0 },
            { name: 'Jack Doe', key: 'a', id: 1 },
            { name: 'Jack Doe', key: 'a', id: 2, deleted: true }
          ]}
        ]);
      });
  });
});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
