import { Hook, HookContext, Service } from '@feathersjs/feathers';

import {
    actOnDefault,
    actOnDispatch,
    alterItems,
    AsyncPredicateFn,
    cache,
    callingParams,
    callingParamsDefaults,
    checkContext,
    checkContextIf,
    combine,
    debug,
    deleteByDot,
    dePopulate,
    dialablePhoneNumber,
    disableMultiItemChange,
    disableMultiItemCreate,
    disablePagination,
    disallow,
    discard,
    discardQuery,
    every,
    existsByDot,
    fastJoin,
    fgraphql,
    FGraphQLHookOptions,
    getByDot,
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
    setByDot,
    setNow,
    setSlug,
    sifter,
    skipRemainingHooks,
    skipRemainingHooksOnFlag,
    softDelete2,
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
import * as libphonenumberjs from 'libphonenumber-js';
import ajv = require('ajv');

const context1: HookContext = {
    type: 'before',
    service: null!
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

// $ExpectType Hook
actOnDefault(hook1, hook2, hook3, hook4);
// $ExpectType Hook
actOnDispatch(hook1, hook2, hook3, hook4);

// $ExpectType Hook
alterItems(rec => {
    delete rec.password;
});

// $ExpectType Hook
alterItems(rec => rec.email = 'somestring'.toLowerCase()); // Like `lowerCase('email')`.

// $ExpectType Hook
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

// $ExpectType Hook
combine(hook1, hook2, hook3);

// $ExpectType Hook
debug('label', 'abc.def', 'ghi.jkl');

// $ExpectType void
deleteByDot({}, 'abc.def');

// $ExpectType Hook
dePopulate();

// $ExpectType Hook
dialablePhoneNumber(libphonenumberjs);

// $ExpectType Hook
disableMultiItemChange();

// $ExpectType Hook
disableMultiItemCreate();

// $ExpectType Hook
disablePagination();

// $ExpectType Hook
disallow('external', 'server');

// $ExpectType Hook
discard('abc', 'def');

// $ExpectType Hook
discardQuery('abc', 'def');

// $ExpectType boolean
existsByDot({}, 'abc.def');

const commentResolvers: ResolverMap<any> = {
    joins: {
        author: $select => async comment => {
            comment.author = (await service1.find({
                query: { id: comment.userId, $select: $select || ['name'] },
                paginate: false
            }) as any)[0];
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
            const memberships: any = (await context.app!.service
                ('memberships').find({
                    query: {
                        user: user._id,
                        $populate: 'role',
                    }
                }));
            user.memberships = memberships.data;
        }
    }
};

// $ExpectType Hook
fastJoin(userResolvers);
// $ExpectType Hook
fastJoin(postResolvers);
// $ExpectType Hook
fastJoin(postResolvers, { abc: 'def' });
// $ExpectType Hook
fastJoin(ctx => postResolvers);
// $ExpectType Hook
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
// $ExpectType Hook
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
// $ExpectType Hook
fgraphql(fgraphqlOptions2);

// $ExpectType any
getByDot({}, 'abc.def');

// $ExpectType any
getItems(context1);

// $ExpectType SyncContextFunction<boolean>
isProvider();

// $ExpectType Hook
keep('abc', 'def');

// $ExpectType Hook
keepInArray('array', ['fieldName', 'fieldName']);

// $ExpectType Hook
keepQuery('name', 'address.city');

// $ExpectType Hook
keepQueryInArray('array', ['fieldName', 'fieldName']);

// $ExpectType Hook
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

// $ExpectType Hook
mongoKeys(ObjId, 'abc');
// $ExpectType Hook
mongoKeys(ObjId, ['abc', 'def']);

paramsForServer({
    query: { dept: 'a' },
    populate: 'po-1',
    serialize: 'po-mgr'
});

// $ExpectType Hook
paramsFromClient('populate', 'serialize', 'otherProp');

// $ExpectType Hook
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

// $ExpectType Hook
preventChanges(true, 'security.badge', 'abc');

// $ExpectType void
replaceItems(context1, [{}, {}]);

// $ExpectType Hook
required('field1', 'field2');

// $ExpectType Promise<any>
runHook()(keep('abc'))([]);
// $ExpectType Promise<any>
runHook(context1)(keep('abc'))([]);

// $ExpectType Hook
runParallel(hook1, x => x);
// $ExpectType Hook
runParallel(hook1, x => x, 7);

// $ExpectType Hook
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

// $ExpectType void
setByDot({}, 'asd', 7);

// $ExpectType Hook
setNow('createdAt', 'updatedAt');

// $ExpectType Hook
setSlug('storeId');

// $ExpectType Hook
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

// $ExpectType Hook
sifter(ctx => item => true);

// $ExpectType Hook
skipRemainingHooks();
// $ExpectType Hook
skipRemainingHooks(context => !context.result);

// $ExpectType Hook
skipRemainingHooksOnFlag('__flag');

// $ExpectType Hook
softDelete2({
    allowIgnoreDeletedAt: true,
    deletedAt: 'someKey',
    patchCall: async (context, options) => { },
    probeCall: async (context, options) => { },
    keepOnCreate: true,
    skipProbeOnGet: true
});

// $ExpectType Hook
stashBefore();
// $ExpectType Hook
stashBefore('abc');

// $ExpectType Hook
traverse(function(node) {
    if (typeof node === 'string') {
        this.update(node.trim());
    }
});
// $ExpectType Hook
traverse(function(node) {
    if (typeof node === 'string') {
        this.update(node.trim());
    }
}, context => context.params!.query);

// $ExpectType Hook
validate(async (data, context) => {
    return { length: 'expected max 3, got 7' };
});

// $ExpectType Hook
validateSchema({}, ajv);

// $ExpectType Hook
iffElse(syncTrue, [hook1, hook2], [hook3, hook4]);
// $ExpectType Hook
iffElse(asyncTrue, [hook1, hook2], [hook3, hook4]);

// $ExpectType IffHook
iff(syncTrue, hook1, hook2);
// $ExpectType IffHook
iff(asyncTrue, hook1, hook2);
// $ExpectType Hook
iff(syncTrue, hook1, hook2).else(hook3, hook4);
// $ExpectType Hook
iff(asyncTrue, hook1, hook2).else(hook3, hook4);

// $ExpectType IffHook
when(syncTrue, hook1, hook2);
// $ExpectType Hook
when(syncTrue, hook1, hook2).else(hook3, hook4);

// $ExpectType Hook
unless(asyncTrue, hook1, hook2);
// $ExpectType Hook
unless(syncTrue, hook1, hook2);

// $ExpectType AsyncContextFunction<boolean>
some(asyncFalse, asyncTrue, syncTrue);

// $ExpectType AsyncContextFunction<boolean>
every(asyncTrue, syncTrue);

// $ExpectType AsyncContextFunction<boolean>
isNot(asyncTrue);
// $ExpectType AsyncContextFunction<boolean>
isNot(syncTrue);
