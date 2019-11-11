
const assert = require('chai').assert;
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const { iff, populate } = require('../../lib/services/index');

const userId = 6;
const userInit = {
  0: { name: 'Jane Doe', key: 'a', id: 0 },
  1: { name: 'Jack Doe', key: 'a', id: 1 },
  2: { name: 'Jack Doe', key: 'a', id: 2, deleted: true },
  3: { name: 'Rick Doe', key: 'b', id: 3 },
  4: { name: 'Dick Doe', key: 'b', id: 4 },
  5: { name: 'Dick Doe', key: 'b', id: 5, deleted: true }
};
const teamId = 2;
const teamInit = {
  0: { team: 'Does', memberIds: [0, 1, 2], id: 0 },
  1: { team: 'Dragons', memberIds: [3, 4, 5], id: 1 }
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
  memberIds: [0, 1, 2],
  id: 0,
  _include: ['members'],
  members: [
    { name: 'Jane Doe', key: 'a', id: 0 },
    { name: 'Jack Doe', key: 'a', id: 1 },
    { name: 'Jack Doe', key: 'a', id: 2, deleted: true }
  ]
}
];

const schemaDefaultTeams = {
  service: 'teams',
  include: [{
    service: 'users',
    nameAs: 'members',
    parentField: 'memberIds',
    childField: 'id'
  }]
};

const schemaDefaultXteams = {
  service: 'xteams',
  include: [{
    service: 'users',
    nameAs: 'members',
    parentField: 'memberIds',
    childField: 'id'
  }]
};

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
    paginate: true
  }]
};

const resultTrue = [{
  team: 'Does',
  memberIds: [0, 1, 2],
  id: 0,
  _include: ['members'],
  members: [
    { name: 'Jane Doe', key: 'a', id: 0 },
    { name: 'Jack Doe', key: 'a', id: 1 }
  ]
}
];

const schema1 = {
  include: [{
    service: 'users',
    nameAs: 'members',
    parentField: 'memberIds',
    childField: 'id',
    paginate: 1
  }]
};

const result1 = [{
  team: 'Does',
  memberIds: [0, 1, 2],
  id: 0,
  _include: ['members'],
  members: { name: 'Jane Doe', key: 'a', id: 0 }
}];

let whichSchema;
let userHookFlag1;
let teamHookFlag1;
let fcnOptions;

function schemaFcn (hook, options) {
  fcnOptions = options;
  return schemaDefault;
}

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

  app.service('users').hooks({
    before: {
      all: [
        hook => { userHookFlag1 = hook.params.userHookFlag1; }
      ]
    }
  });
}

function team () {
  const app = this;

  app.use('/teams', memory({
    store: clone(teamInit),
    startId: teamId
  }));

  app.service('teams').hooks({
    after: {
      all: [
        hook => { teamHookFlag1 = hook.params.teamHookFlag1; },
        iff(() => whichSchema === 'schemaDefault', populate({ schema: schemaDefault })),
        iff(() => whichSchema === 'schemaFalse', populate({ schema: schemaFalse })),
        iff(() => whichSchema === 'schemaTrue', populate({ schema: schemaTrue })),
        iff(() => whichSchema === 'schema1', populate({ schema: schema1 })),
        iff(() => whichSchema === 'schemaDefaultTeams', populate({ schema: schemaDefaultTeams })),
        iff(() => whichSchema === 'schemaDefaultXteams', populate({ schema: schemaDefaultXteams })),
        iff(() => whichSchema === 'schemaDefaultFcn', populate({ schema: schemaFcn }))
      ]
    }
  });
}

describe('services populate - hook.params passed to includes', () => {
  let app;
  let teams;

  beforeEach(() => {
    app = feathers()
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

  it('uses configuration when paginate:true', () => {
    whichSchema = 'schemaTrue';
    return teams.find({ query: { id: 0 } })
      .then(result => {
        assert.deepEqual(result, resultTrue);
      });
  });

  it('can specify number of results to return', () => {
    whichSchema = 'schema1';
    return teams.find({ query: { id: 0 } })
      .then(result => {
        assert.deepEqual(result, result1);
      });
  });

  it('passes on correct base service', () => {
    whichSchema = 'schemaDefaultTeams';
    return teams.find({ query: { id: 0 } })
      .then(result => {
        assert.deepEqual(result, resultDefault);
      });
  });

  it('throws on incorrect base service', () => {
    whichSchema = 'schemaDefaultXteams';
    return teams.find({ query: { id: 0 } })
      .then(() => {
        assert.fail(true, false, 'unexpected succeeded');
      })
      .catch(err => {
        assert.equal(err.className, 'bad-request');
      });
  });
});

describe('services populate - schema may be a function', () => {
  let app;
  let teams;

  beforeEach(() => {
    app = feathers()
      .configure(services);
    teams = app.service('teams');
    userHookFlag1 = null;
    fcnOptions = null;
  });

  it('calls the function', () => {
    whichSchema = 'schemaDefaultFcn';
    return teams.find({ query: { id: 0 }, userHookFlag1: 'userHookFlag1' })
      .then(result => {
        assert.equal(userHookFlag1, 'userHookFlag1');
        assert.deepEqual(result, resultDefault);
      });
  });

  it('function gets hook and options', () => {
    whichSchema = 'schemaDefaultFcn';
    return teams.find(
      { query: { id: 0 }, userHookFlag1: 'userHookFlag1', teamHookFlag1: 'teamHookFlag1' }
    )
      .then(result => {
        assert.equal(teamHookFlag1, 'teamHookFlag1');
        assert.strictEqual(fcnOptions.schema, schemaFcn);

        assert.equal(userHookFlag1, 'userHookFlag1');
        assert.deepEqual(result, resultDefault);
      });
  });
});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
