import { Hook, HookContext, Service, default as feathers } from '@feathersjs/feathers';

import {
    actOnDefault,
    actOnDispatch,
    alterItems,
    AsyncContextFunction,
    AsyncPredicateFn,
    cache,
    callingParams,
    callingParamsDefaults,
    checkContext,
    checkContextIf,
    combine,
    debug,
    dePopulate,
    disablePagination,
    disallow,
    discard,
    discardQuery,
    every,
    fastJoin,
    fgraphql,
    FGraphQLHookOptions,
    getItems,
    iff,
    iffElse,
    isNot,
    isProvider,
    keep,
    keepInArray,
    keepQuery,
    keepQueryInArray,
    lowerCase,
    makeCallingParams,
    mongoKeys,
    paramsForServer,
    paramsFromClient,
    populate,
    preventChanges,
    replaceItems,
    required,
    ResolverMap,
    runHook,
    runParallel,
    sequelizeConvert,
    serialize,
    setNow,
    setSlug,
    sifter,
    softDelete,
    some,
    stashBefore,
    SyncPredicateFn,
    traverse,
    unless,
    validate,
    validateSchema,
    when,
} from 'feathers-hooks-common';
import { parse } from 'graphql';
import ajv = require('ajv');

const context1: HookContext = {
    type: 'before',
    app: feathers(),
    method: 'create',
    params: {},
    path: '/',
    service: null
};

const hook1: Hook = ctx => ctx;
const hook2: Hook = ctx => ctx;
const hook3: Hook = async ctx => ctx;
const hook4: Hook = async ctx => ctx;

const syncTrue: SyncPredicateFn = ctx => true;
const syncFalse: SyncPredicateFn = ctx => false;

const asyncTrue: AsyncPredicateFn = async ctx => true;
const asyncFalse: AsyncPredicateFn = async ctx => false;

const service1: Service<any> = null as any;

// TESTS BEGIN

// $ExpectType Hook<any, Service<any>>
actOnDefault(hook1, hook2, hook3, hook4);
// $ExpectType Hook<any, Service<any>>
actOnDispatch(hook1, hook2, hook3, hook4);

// $ExpectType Hook<any, Service<any>>
alterItems(rec => {
    delete rec.password;
});

// $ExpectType Hook<any, Service<any>>
alterItems(rec => rec.email = 'somestring'.toLowerCase()); // Like `lowerCase('email')`.

// $ExpectType Hook<any, Service<any>>
cache(new Map(), 'a', { clone: x => x });

// $ExpectType Params
callingParams({
    query: { id: { $in: [1, 2, 3] } },
    propNames: ['customProp'],
    newProps: { mongoose: { /*...*/ } },
    hooksToDisable: 'populate'
})(context1);

// $ExpectType void
callingParamsDefaults(['abc', 'def'], {
    someData: {}
});
// $ExpectType void
checkContext(context1, 'before', ['update', 'patch'], 'hookName');
// $ExpectType void
checkContext(context1, null, ['update', 'patch']);
// $ExpectType void
checkContext(context1, 'before', null, 'hookName');
// $ExpectType void
checkContext(context1, 'before');

// $ExpectType void
checkContextIf(context1, 'before', ['update', 'patch'], 'hookName');

// $ExpectType Hook<any, Service<any>>
combine(hook1, hook2, hook3);

// $ExpectType Hook<any, Service<any>>
debug('label', 'abc.def', 'ghi.jkl');

// $ExpectType Hook<any, Service<any>>
dePopulate();

// $ExpectType Hook<any, Service<any>>
disablePagination();

// $ExpectType Hook<any, Service<any>>
disallow('external', 'server');

// $ExpectType Hook<any, Service<any>>
discard('abc', 'def');

// $ExpectType Hook<any, Service<any>>
discardQuery('abc', 'def');

softDelete({
    removeData: async () => ({})
});

const commentResolvers: ResolverMap<any> = {
    joins: {
        author: $select => async comment => {
            const authors = await service1.find({
                query: { id: comment.userId, $select: $select || ['name'] },
                paginate: false
            });
            comment.author = authors[0];
        },
    },
};

const postResolvers: ResolverMap<any> = {
    joins: {
        comments: {
            resolver: ($select, $limit, $sort) => async post => {
                post.comments = await service1.find({
                    query: { postId: post.id, $select, $limit: $limit || 5, [$sort]: { createdAt: -1 } },
                    paginate: false
                });
                return post.comments;
            },

            joins: commentResolvers,
        },
    }
};

const userResolvers: ResolverMap<any> = {
    joins: {
        memberships: () => async (user, context) => {
            const memberships = await context.app.service('memberships').find({
                query: {
                    user: user._id,
                    $populate: 'role',
                }
            });
            user.memberships = memberships.data;
        }
    }
};

// $ExpectType Hook<any, Service<any>>
fastJoin(userResolvers);
// $ExpectType Hook<any, Service<any>>
fastJoin(postResolvers);
// $ExpectType Hook<any, Service<any>>
fastJoin(postResolvers, { abc: 'def' });
// $ExpectType Hook<any, Service<any>>
fastJoin(ctx => postResolvers);
// $ExpectType Hook<any, Service<any>>
fastJoin(postResolvers);

// used from https://github.com/feathers-plus/hooks-graphql-example
const fgraphqlOptions: FGraphQLHookOptions = {
    parse,
    runTime: null,
    schema: ``,
    recordType: "user",
    query: {
        posts: {},
        comments: {},
        followed_by: {},
        following: {},
        likes: {}
    },
    resolvers: () => ({
        Comment: {
            author: () => ({}),
            likes: () => ({}),
        },
        Query: {}
    })
};
// $ExpectType Hook<any, Service<any>>
fgraphql(fgraphqlOptions);

const fgraphqlOptions2: FGraphQLHookOptions = {
    ...fgraphqlOptions,
    query: (context: HookContext) => ({
        posts: {},
        comments: {},
        followed_by: {},
        following: {},
        likes: {}
    }),
    resolvers: {
        Comment: {
            author: () => ({}),
            likes: () => ({}),
        },
        Query: {}
    },
    options: {
        extraAuthProps: ['asdf'],
        inclAllFields: false,
        inclJoinedNames: false,
        inclAllFieldsClient: true,
        inclAllFieldsServer: true,
        skipHookWhen: (context) => { context.data; return false; }
    }
};
// $ExpectType Hook<any, Service<any>>
fgraphql(fgraphqlOptions2);

// $ExpectType any
getItems(context1);

// $ExpectType SyncContextFunction<boolean>
isProvider();

// $ExpectType Hook<any, Service<any>>
keep('abc', 'def');

// $ExpectType Hook<any, Service<any>>
keepInArray('array', ['fieldName', 'fieldName']);

// $ExpectType Hook<any, Service<any>>
keepQuery('name', 'address.city');

// $ExpectType Hook<any, Service<any>>
keepQueryInArray('array', ['fieldName', 'fieldName']);

// $ExpectType Hook<any, Service<any>>
lowerCase('email', 'username', 'div.dept');

// $ExpectType Params
makeCallingParams(
    context1,
    { id: { $in: [1, 2, 3] } },
    'user',
    { _populate: false, mongoose: {} }
);

// tslint:disable-next-line
class ObjId {
    // tslint:disable-next-line
    constructor(id?: string | number) { }
}

// $ExpectType Hook<any, Service<any>>
mongoKeys(ObjId, 'abc');
// $ExpectType Hook<any, Service<any>>
mongoKeys(ObjId, ['abc', 'def']);

paramsForServer({
    query: { dept: 'a' },
    populate: 'po-1',
    serialize: 'po-mgr'
});

// $ExpectType Hook<any, Service<any>>
paramsFromClient('populate', 'serialize', 'otherProp');

// $ExpectType Hook<any, Service<any>>
populate({
    schema: {
        include: {
            service: 'roles',
            nameAs: 'role',
            parentField: 'roleId',
            childField: '_id'
        }
    }
});

// $ExpectType Hook<any, Service<any>>
preventChanges(true, 'security.badge', 'abc');

// $ExpectType void
replaceItems(context1, [{}, {}]);

// $ExpectType Hook<any, Service<any>>
required('field1', 'field2');

// $ExpectType Promise<any>
runHook()(keep('abc'))([]);
// $ExpectType Promise<any>
runHook(context1)(keep('abc'))([]);

// $ExpectType Hook<any, Service<any>>
runParallel(hook1, x => x);
// $ExpectType Hook<any, Service<any>>
runParallel(hook1, x => x, 7);

// $ExpectType Hook<any, Service<any>>
serialize({
    only: 'updatedAt',
    computed: {
        commentsCount: (recommendation, hook) => recommendation.post.commentsInfo.length,
    },
    post: {
        exclude: ['id', 'createdAt', 'author', 'readers'],
        authorItem: {
            exclude: ['id', 'password', 'age'],
            computed: {
                isUnder18: (authorItem, hook) => authorItem.age < 18,
            },
        },
        readersInfo: {
            exclude: 'id',
        },
        commentsInfo: {
            only: ['title', 'content'],
            exclude: 'content',
        },
    },
});

// $ExpectType Hook<any, Service<any>>
setNow('createdAt', 'updatedAt');

// $ExpectType Hook<any, Service<any>>
setSlug('storeId');

// $ExpectType Hook<any, Service<any>>
sequelizeConvert({
    aBool: 'boolean',
    aDate: 'date',
    anObject: 'json',
    aNumber: 'strToInt'
}, null, {
        strToInt: {
            js: (sqlValue: string) => +sqlValue,
            sql: (jsValue: number) => `${jsValue}`,
        }
    });

// $ExpectType Hook<any, Service<any>>
sifter(ctx => item => true);

// $ExpectType Hook<any, Service<any>>
stashBefore();
// $ExpectType Hook<any, Service<any>>
stashBefore('abc');

// $ExpectType Hook<any, Service<any>>
traverse(function(node) {
    if (typeof node === 'string') {
        this.update(node.trim());
    }
});
// $ExpectType Hook<any, Service<any>>
traverse(function(node) {
    if (typeof node === 'string') {
        this.update(node.trim());
    }
}, context => context.params.query);

// $ExpectType Hook<any, Service<any>>
validate(async (data, context) => {
    return { length: 'expected max 3, got 7' };
});

// $ExpectType Hook<any, Service<any>>
validateSchema({}, ajv);

// $ExpectType Hook<any, Service<any>>
iffElse(syncTrue, [hook1, hook2], [hook3, hook4]);
// $ExpectType Hook<any, Service<any>>
iffElse(asyncTrue, [hook1, hook2], [hook3, hook4]);

// $ExpectType IffHook
iff(syncTrue, hook1, hook2);
// $ExpectType IffHook
iff(asyncTrue, hook1, hook2);
// $ExpectType Hook<any, Service<any>>
iff(syncTrue, hook1, hook2).else(hook3, hook4);
// $ExpectType Hook<any, Service<any>>
iff(asyncTrue, hook1, hook2).else(hook3, hook4);

// $ExpectType IffHook
when(syncTrue, hook1, hook2);
// $ExpectType Hook<any, Service<any>>
when(syncTrue, hook1, hook2).else(hook3, hook4);

// $ExpectType Hook<any, Service<any>>
unless(asyncTrue, hook1, hook2);
// $ExpectType Hook<any, Service<any>>
unless(syncTrue, hook1, hook2);

some(asyncFalse, asyncTrue, syncTrue);
every(asyncTrue, syncTrue);
isNot(asyncTrue);
isNot(syncTrue);
