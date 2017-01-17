
const assert = require('chai').assert;
const feathers = require('feathers');
const memory = require('feathers-memory');
const feathersHooks = require('feathers-hooks');
const { iff, populate } = require('../../src/services/index');

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

const schemaDefault = {
  include: [{
    service: 'users',
    nameAs: 'members',
    parentField: 'memberIds',
    childField: 'id'
  }]
};

const resultDefault = [{
  team: 'Does',
  memberIds: [ 0, 1, 2 ],
  id: 0,
  _include: [ 'members' ],
  members: [
    { name: 'Jane Doe', key: 'a', id: 0 },
    { name: 'Jack Doe', key: 'a', id: 1 },
    { name: 'Jack Doe', key: 'a', id: 2, deleted: true }
  ]}
];

const resultPaginated = [{
  team: 'Does',
  memberIds: [ 0, 1, 2 ],
  id: 0,
  _include: [ 'members' ],
  members: [
    { name: 'Jane Doe', key: 'a', id: 0 },
    { name: 'Jack Doe', key: 'a', id: 1 }
  ]}
];

const schemaFalse = {
  include: [{
    service: 'users',
    nameAs: 'members',
    parentField: 'memberIds',
    childField: 'id',
    paginate: false
  }]
};

const schemaTrue = {
  include: [{
    service: 'users',
    nameAs: 'members',
    parentField: 'memberIds',
    childField: 'id',
    paginate: { default: 2 }
  }]
};

let whichSchema;
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
    startId: userId,
    paginate: {
      default: 2,
      max: 2
    }
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
    all: [
      iff(hook => whichSchema === 'schemaDefault', populate({ schema: schemaDefault })),
      iff(hook => whichSchema === 'schemaFalse', populate({ schema: schemaFalse })),
      iff(hook => whichSchema === 'schemaTrue', populate({ schema: schemaTrue }))
    ]
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
    whichSchema = 'schemaDefault';
    return teams.find({ query: { id: 0 }, userHookFlag1: 'userHookFlag1' })
      .then(result => {
        assert.equal(userHookFlag1, 'userHookFlag1');
        assert.deepEqual(result, resultDefault);
      });
  });

  it('ignores pagination by default', () => {
    whichSchema = 'schemaDefault';
    return teams.find({ query: { id: 0 } })
      .then(result => {
        assert.deepEqual(result, resultDefault);
      });
  });

  it('ignores pagination when paginate:false', () => {
    whichSchema = 'schemaFalse';
    return teams.find({ query: { id: 0 } })
      .then(result => {
        assert.deepEqual(result, resultDefault);
      });
  });

  it('does pagination when paginate:true', () => {
    whichSchema = 'schemaTrue';
    return teams.find({ query: { id: 0 } })
      .then(result => {
        assert.deepEqual(result, resultPaginated);
      });
  });
});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
