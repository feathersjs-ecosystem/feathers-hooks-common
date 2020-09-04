# Changelog

## [v5.0.4](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v5.0.4) (2020-09-04)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v5.0.3...v5.0.4)

**Closed issues:**

- Populate type definition does not represent the docs [\#594](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/594)
- Object spread not supported in legacy Edge [\#587](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/587)

**Merged pull requests:**

- Fix multi record remove cache [\#605](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/605) ([uulwake](https://github.com/uulwake))
- chore\(dependencies\): Update all dependencies [\#604](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/604) ([github-actions[bot]](https://github.com/apps/github-actions))
- Fix typo Socket.io [\#602](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/602) ([mdartic](https://github.com/mdartic))
- chore\(dependencies\): Update all dependencies [\#601](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/601) ([github-actions[bot]](https://github.com/apps/github-actions))
- Fix links for fastJoin and populate [\#599](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/599) ([mdartic](https://github.com/mdartic))
- chore\(dependencies\): Update all dependencies [\#598](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/598) ([github-actions[bot]](https://github.com/apps/github-actions))
- Fix error in docs at utilities\#callingparams [\#597](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/597) ([Barbapapazes](https://github.com/Barbapapazes))
- Fixes populate type definition does not represent the docs [\#596](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/596) ([TheSinding](https://github.com/TheSinding))
- chore\(dependencies\): Update all dependencies [\#595](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/595) ([github-actions[bot]](https://github.com/apps/github-actions))
- chore\(dependencies\): Update all dependencies [\#592](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/592) ([github-actions[bot]](https://github.com/apps/github-actions))

## [v5.0.3](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v5.0.3) (2020-04-29)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v5.0.2...v5.0.3)

**Implemented enhancements:**

- Hook to support $search in query [\#501](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/501)
- Pass client info into socket [\#493](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/493)
- Improvement: Add tests for cache hook, using service calls. [\#353](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/353)

**Closed issues:**

- An in-range update of @feathersjs/feathers is breaking the build 🚨 [\#583](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/583)
- Argument of type xxx is not assignable to parameter of type xxx [\#579](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/579)
- Cache hook returns improper values when using $select or query on methods other than find\(\) [\#575](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/575)
- Validation hook for passwords [\#471](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/471)
- Support $search for MongoDB [\#451](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/451)
- Hook to set HTTP status code [\#443](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/443)
- find and stash [\#430](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/430)
- Convert JS dates to/from strings/integers on service calls. [\#429](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/429)
- suggestion: hook to emit \(fake\) event [\#422](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/422)
- Highlight use of combine for more complex decision making. [\#401](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/401)
- Design: More generalized hook structures [\#366](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/366)
- Suggestion: Add hooks for channels [\#318](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/318)
- Suggestion: find or create [\#227](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/227)
- Suggestion: General copy hook [\#222](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/222)
- Suggestion: `$count` special query param? Where it literally just returns the number in place of `hook.result`. [\#81](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/81)

**Merged pull requests:**

- Update all dependencies [\#585](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/585) ([daffl](https://github.com/daffl))
- docs: fix indent [\#577](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/577) ([fratzinger](https://github.com/fratzinger))
- Bug/cache select [\#576](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/576) ([DaddyWarbucks](https://github.com/DaddyWarbucks))
- Fix markdown of fastJoin code example [\#573](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/573) ([matiaslopezd](https://github.com/matiaslopezd))
- Changing Object ID import on mongoKeys hook [\#571](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/571) ([luizfer](https://github.com/luizfer))

## [v5.0.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v5.0.2) (2020-01-23)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v5.0.1...v5.0.2)

**Fixed bugs:**

- setSlug not working in buzzard [\#380](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/380)

**Closed issues:**

- Allow mutating the order of hook functions [\#180](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/180)

**Merged pull requests:**

- Move to GitHub actions and update all dependencies [\#591](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/591) ([daffl](https://github.com/daffl))
- Greenkeeper/sift 11.0.9 [\#566](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/566) ([daffl](https://github.com/daffl))
- Change check for external provider as per daffl in disallow.js by 104c1b1 [\#565](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/565) ([jalbersdorfer](https://github.com/jalbersdorfer))
- Fix formatting of the Header for the `runHook` documentation [\#563](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/563) ([pdfowler](https://github.com/pdfowler))
- :pencil2: fix minor typos [\#561](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/561) ([arfanliaqat](https://github.com/arfanliaqat))

## [v5.0.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v5.0.1) (2019-12-31)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v5.0.0...v5.0.1)

**Implemented enhancements:**

- Doument fgraphql [\#466](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/466)
- Clarify fastJoin API docs. [\#452](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/452)
- Improvement: review alterItems tests [\#408](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/408)

**Closed issues:**

- TypeScript definition for fastJoin don't reflect examples for recursive resolvers [\#521](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/521)
- Write docs for sequelizeConvert [\#497](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/497)
- Suggestion: Utility to allow hooks to be skippable. [\#417](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/417)
- Suggestion: possible enhancement: utilities to extract info from `app` [\#416](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/416)
- Suggestion: Add DB specific hooks [\#347](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/347)
- Suggestion: Perhaps setNow should only run in the before hooks. [\#287](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/287)
- Suggestion: Introduce modifyWithSlug & getWithSlug [\#235](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/235)
- docs: more on composing hooks [\#208](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/208)

**Merged pull requests:**

- Tweaks for v5 release [\#560](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/560) ([daffl](https://github.com/daffl))

## [v5.0.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v5.0.0) (2019-12-31)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.20.7...v5.0.0)

**Implemented enhancements:**

- Improvement: Upgrade to ajv ^6.1.1 [\#372](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/372)
- Using a hook.disable\(\) on a service should remove that from the Allow header for REST services [\#224](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/224)

**Fixed bugs:**

- Clarification on softDelete2 [\#455](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/455)

**Closed issues:**

- An in-range update of @feathersjs/feathers is breaking the build 🚨 [\#558](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/558)
- An in-range update of @feathersjs/socketio is breaking the build 🚨 [\#553](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/553)
- An in-range update of @feathersjs/authentication-local is breaking the build 🚨 [\#552](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/552)
- An in-range update of @feathersjs/authentication is breaking the build 🚨 [\#551](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/551)
- An in-range update of @feathersjs/socketio-client is breaking the build 🚨 [\#550](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/550)
- An in-range update of @feathersjs/express is breaking the build 🚨 [\#549](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/549)
- An in-range update of @feathersjs/feathers is breaking the build 🚨 [\#548](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/548)
- An in-range update of @feathersjs/errors is breaking the build 🚨 [\#547](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/547)
- feathers 4 with softDelete2 and feathers-mongoose fails with 404 not found [\#532](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/532)
- version upgrade for feathers v4 [\#531](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/531)
- SoftDelete2 - before hook for 'get' method returned invalid hook object [\#528](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/528)
- Doesn't work with @feathersjs/feathers@^4.3.0-pre.3 [\#526](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/526)
- SoftDelete2 throws with feathers-sequelize 5 and above [\#524](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/524)
- Race Condition in defaultPatchCall of SoftDelete2 [\#523](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/523)
- SoftDelete2 Skip Symbol mismatch in browser [\#522](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/522)
- \[REGRESSION\]: 4.8.0-4.20.7 args is not iterable error on initiation [\#520](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/520)
- populate include array [\#519](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/519)
- fastJoin not reactive [\#517](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/517)
- `keep` fails when object key contains dot [\#514](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/514)
- TypeScript definitions for iff [\#512](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/512)
- SoftDelete2 use null or -1 [\#508](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/508)
- Many-to-many fastJoin [\#505](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/505)
- Remove fgraphql-async as its not used [\#482](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/482)
- Proposal: Don't mutate objects in common hooks [\#480](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/480)
- Support dot notation in params.query [\#441](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/441)
- keep doesn't keep false values [\#425](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/425)
- createdBY, updatedBy hook [\#379](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/379)
- Doc running hooks async from hook chain [\#370](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/370)

**Merged pull requests:**

- Update @types/node to the latest version 🚀 [\#559](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/559) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Update dependencies and fix expected TypeScript type [\#557](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/557) ([daffl](https://github.com/daffl))
- VuePress docs [\#556](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/556) ([marshallswain](https://github.com/marshallswain))
- modify stashBefore hook, move $disableStashBefore from query to params [\#555](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/555) ([marshallswain](https://github.com/marshallswain))
- Add vscode launch script for debugging Mocha tests [\#554](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/554) ([marshallswain](https://github.com/marshallswain))
- Update typings [\#545](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/545) ([daffl](https://github.com/daffl))
- New softDelete for Feathers 4 [\#544](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/544) ([daffl](https://github.com/daffl))
- Safely delete properties using lodash/omit [\#543](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/543) ([daffl](https://github.com/daffl))
- Update sift to the latest version 🚀 [\#542](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/542) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Use Lodash for utility functions [\#541](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/541) ([daffl](https://github.com/daffl))
- Remove all deprecated hooks [\#540](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/540) ([daffl](https://github.com/daffl))
- Update dtslint in group default to the latest version 🚀 [\#539](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/539) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Update dependencies for default 🌴 [\#538](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/538) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Update badges [\#537](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/537) ([daffl](https://github.com/daffl))
- Upgrade to Feathers v4 [\#536](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/536) ([daffl](https://github.com/daffl))
- Update dependencies to enable Greenkeeper 🌴 [\#534](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/534) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Update README.md [\#525](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/525) ([bartduisters](https://github.com/bartduisters))
- Upgrade ajv dependency and fix failing tests. [\#518](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/518) ([rybaczewa](https://github.com/rybaczewa))
- Annoying typo fixed [\#516](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/516) ([james2mid](https://github.com/james2mid))
- Ensure `existsByDot` and `getByDot` honour properties with dots in keys [\#515](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/515) ([anthonygood](https://github.com/anthonygood))
- Updated typings. [\#513](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/513) ([deskoh](https://github.com/deskoh))
- Fix promise-to-callback hook preventing other hook import. [\#506](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/506) ([rybaczewa](https://github.com/rybaczewa))
- Delete unused fgraphql-async. Added sequelizeConvert. [\#499](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/499) ([eddyystop](https://github.com/eddyystop))

## [v4.20.7](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.20.7) (2019-02-22)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.20.6...v4.20.7)

## [v4.20.6](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.20.6) (2019-02-22)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.20.5...v4.20.6)

## [v4.20.5](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.20.5) (2019-02-22)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.20.4...v4.20.5)

## [v4.20.4](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.20.4) (2019-02-22)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.20.2...v4.20.4)

**Implemented enhancements:**

- Finish dialablePhoneNumber hook [\#474](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/474)

**Closed issues:**

- query regarding set response to hook :after create [\#507](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/507)
- Many-to-many fastJoin [\#504](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/504)

**Merged pull requests:**

- Update iff predicates typings to be either sync or async [\#509](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/509) ([NickBolles](https://github.com/NickBolles))

## [v4.20.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.20.2) (2019-01-11)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.20.1...v4.20.2)

**Closed issues:**

- Add typings for sequelizeConvert [\#498](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/498)

**Merged pull requests:**

- add types for sequelizeConvert hook [\#502](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/502) ([j2L4e](https://github.com/j2L4e))

## [v4.20.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.20.1) (2019-01-11)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.20.0...v4.20.1)

**Merged pull requests:**

- update type definition for debug hook [\#500](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/500) ([brane53](https://github.com/brane53))
- move `@types/graphql` package from `devDependencies` into `dependencies` [\#496](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/496) ([j2L4e](https://github.com/j2L4e))

## [v4.20.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.20.0) (2019-01-07)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.19.8...v4.20.0)

## [v4.19.8](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.19.8) (2019-01-04)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.19.7...v4.19.8)

**Fixed bugs:**

- Typings needed for libphonenumber-js [\#495](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/495)

**Closed issues:**

- graphql dependency [\#487](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/487)

## [v4.19.7](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.19.7) (2019-01-04)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.19.6...v4.19.7)

**Closed issues:**

- @feathersjs/commons dependency  [\#492](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/492)
- Validation hook for restful api [\#491](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/491)
- TS for keep fgraphql [\#467](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/467)

**Merged pull requests:**

- Remove redundant $eq to be compatible with all database adapters [\#494](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/494) ([KidkArolis](https://github.com/KidkArolis))
- fix typings test [\#489](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/489) ([j2L4e](https://github.com/j2L4e))
- fix: use graphql as a dependency to resolve TS type definition problems [\#488](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/488) ([PowerMogli](https://github.com/PowerMogli))

## [v4.19.6](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.19.6) (2018-12-13)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.19.5...v4.19.6)

**Merged pull requests:**

- Trying to fix situational test failure soft-delete2-c timeout [\#486](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/486) ([eddyystop](https://github.com/eddyystop))
- Merge forced by pr\#484 [\#485](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/485) ([eddyystop](https://github.com/eddyystop))

## [v4.19.5](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.19.5) (2018-12-13)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.19.4...v4.19.5)

**Closed issues:**

- TS for keepQueryInArray [\#468](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/468)
- dtslint-build folder in installed package? [\#461](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/461)

**Merged pull requests:**

- add asynciterable to tsconfig and bump ts version [\#484](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/484) ([j2L4e](https://github.com/j2L4e))
- add typings for dialablePhoneNumber hook, add libphonenumber-js as a dependency [\#477](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/477) ([j2L4e](https://github.com/j2L4e))
- Add initial types for fgraphql [\#469](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/469) ([NickBolles](https://github.com/NickBolles))
- remove dtslint workaround in favor of npx [\#463](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/463) ([j2L4e](https://github.com/j2L4e))

## [v4.19.4](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.19.4) (2018-11-29)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.19.3...v4.19.4)

**Merged pull requests:**

- update names and fix the options property [\#481](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/481) ([NickBolles](https://github.com/NickBolles))
- Fixed dialablePhoneNumber [\#476](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/476) ([eddyystop](https://github.com/eddyystop))

## [v4.19.3](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.19.3) (2018-11-29)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.19.2...v4.19.3)

**Merged pull requests:**

- Added dialablePhoneNumber hook [\#475](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/475) ([eddyystop](https://github.com/eddyystop))

## [v4.19.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.19.2) (2018-11-25)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.19.1...v4.19.2)

## [v4.19.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.19.1) (2018-11-25)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.19.0...v4.19.1)

**Fixed bugs:**

- Cache Fails When Using $select [\#472](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/472)

**Merged pull requests:**

- Fixed cache to ignore find calls with [\#473](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/473) ([eddyystop](https://github.com/eddyystop))
- required\(\) of value false throws fieldname is null [\#470](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/470) ([antarasi](https://github.com/antarasi))

## [v4.19.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.19.0) (2018-11-17)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.18.0...v4.19.0)

## [v4.18.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.18.0) (2018-11-17)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.14...v4.18.0)

**Implemented enhancements:**

- Document KeepQueryInarray [\#465](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/465)

**Closed issues:**

- Difference between serialize and alterItems [\#464](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/464)
- softDelete2 returns error on delete [\#462](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/462)

**Merged pull requests:**

- Added `keepQueryInArray` hook to keep query fields from a nested array [\#454](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/454) ([dekelev](https://github.com/dekelev))

## [v4.17.14](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.14) (2018-11-01)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.13...v4.17.14)

## [v4.17.13](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.13) (2018-11-01)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.12...v4.17.13)

**Merged pull requests:**

- Added support for dePopulate to fgraphql hook. [\#459](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/459) ([eddyystop](https://github.com/eddyystop))

## [v4.17.12](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.12) (2018-10-29)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.11...v4.17.12)

**Merged pull requests:**

- Added custom dePopulate func to dePopulate hook.' [\#458](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/458) ([eddyystop](https://github.com/eddyystop))

## [v4.17.11](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.11) (2018-10-26)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.10...v4.17.11)

**Closed issues:**

- fastJoin loop [\#453](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/453)

**Merged pull requests:**

- Added fgraphql hook. [\#457](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/457) ([eddyystop](https://github.com/eddyystop))

## [v4.17.10](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.10) (2018-09-26)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.9...v4.17.10)

## [v4.17.9](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.9) (2018-09-26)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.8...v4.17.9)

**Closed issues:**

- How to pass query parameters from the client to fastJoin [\#447](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/447)

**Merged pull requests:**

- Add missing 'create' method in MethodName type [\#449](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/449) ([murbanowicz](https://github.com/murbanowicz))

## [v4.17.8](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.8) (2018-09-24)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.7...v4.17.8)

## [v4.17.7](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.7) (2018-09-24)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.6...v4.17.7)

**Closed issues:**

- fastJoin applied but not sent to client when called from server [\#446](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/446)

**Merged pull requests:**

- Typings: Add context to resolver callback arguments. [\#448](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/448) ([j2L4e](https://github.com/j2L4e))

## [v4.17.6](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.6) (2018-09-19)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.5...v4.17.6)

## [v4.17.5](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.5) (2018-09-19)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.4...v4.17.5)

**Merged pull requests:**

- fix: isProvider returns a boolean [\#444](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/444) ([bitflower](https://github.com/bitflower))

## [v4.17.4](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.4) (2018-09-13)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.3...v4.17.4)

## [v4.17.3](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.3) (2018-09-13)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.2...v4.17.3)

**Merged pull requests:**

- Add documentation links to typings [\#442](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/442) ([j2L4e](https://github.com/j2L4e))

## [v4.17.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.2) (2018-09-10)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.1...v4.17.2)

## [v4.17.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.1) (2018-09-10)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.17.0...v4.17.1)

## [v4.17.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.17.0) (2018-09-10)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.16.3...v4.17.0)

**Closed issues:**

- Which hook to use? [\#436](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/436)
- discard not working [\#435](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/435)

**Merged pull requests:**

- typings CI testing [\#440](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/440) ([j2L4e](https://github.com/j2L4e))
- Revert "\[WIP\] Typings: Set up CI testing" [\#439](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/439) ([eddyystop](https://github.com/eddyystop))
- \[WIP\] Typings: Set up CI testing [\#438](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/438) ([j2L4e](https://github.com/j2L4e))
- add typings file + infrastructure [\#437](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/437) ([j2L4e](https://github.com/j2L4e))
- Update npm installed version [\#434](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/434) ([bravo-kernel](https://github.com/bravo-kernel))

## [v4.16.3](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.16.3) (2018-08-25)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.16.2...v4.16.3)

**Implemented enhancements:**

- Cache with mongoose ObjectId will fail to find the keyFieldName in cache [\#424](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/424)

**Closed issues:**

- Create TypeScript typings for this package [\#432](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/432)

**Merged pull requests:**

- Added `keepQuery` support for keeping props with dot in their name [\#431](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/431) ([dekelev](https://github.com/dekelev))
- Update alter-items.js [\#428](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/428) ([bertho-zero](https://github.com/bertho-zero))

## [v4.16.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.16.2) (2018-08-14)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.16.1...v4.16.2)

**Merged pull requests:**

- Enhanced cache with MongoDB/Mongoose support [\#427](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/427) ([eddyystop](https://github.com/eddyystop))

## [v4.16.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.16.1) (2018-08-14)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.16.0...v4.16.1)

**Merged pull requests:**

- Allows custom methods in checkContext [\#426](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/426) ([eddyystop](https://github.com/eddyystop))

## [v4.16.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.16.0) (2018-08-04)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.15.0...v4.16.0)

**Merged pull requests:**

- Added prep for skipRemaingHooksOnFlag [\#423](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/423) ([eddyystop](https://github.com/eddyystop))
- Delete's not a thing [\#421](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/421) ([rayfoss](https://github.com/rayfoss))
- Added `keepInArray` hook to keep fields from a nested array [\#420](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/420) ([dekelev](https://github.com/dekelev))
- remove hook removal explained [\#405](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/405) ([rayfoss](https://github.com/rayfoss))

## [v4.15.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.15.0) (2018-07-24)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.14.3...v4.15.0)

**Implemented enhancements:**

- softDelete with a date instead of boolean [\#385](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/385)
- Consider some ideas for softDelete [\#339](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/339)
- See if there are features to add to validateSchema [\#317](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/317)
- Headers info is removed which makes custom API KEY authorization impossible [\#306](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/306)
- Add hooks from feathers-hooks-extra [\#276](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/276)
- softDelete preliminary get should not cause populate to run [\#270](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/270)
- Feature Request: Querying for sub relationships on related data [\#248](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/248)
- Generalized `get` utility for use in a hook [\#217](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/217)
- Add some \(trivial\) Sequelize-oriented hooks [\#210](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/210)
- Implicit eager-loading when querying with dot-notation [\#207](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/207)
- convert date for db adapters [\#153](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/153)

**Fixed bugs:**

- Using softDelete and stashBefore results in infinite loop [\#345](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/345)
- Interaction between softDelete and populate on get\(\) [\#284](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/284)
- SoftDelete Hook still called twice [\#238](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/238)

**Closed issues:**

- validateSchema with type: array [\#364](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/364)
- How to use getResultsByKey when querying a field with array of ids [\#358](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/358)
- add, remove, replace hooks dynamically. \(Consider services too.\) [\#322](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/322)
- Suggestion: Hooks specialized for Sequelize [\#321](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/321)
- Follow mongoose schema validation repo [\#299](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/299)
- Suggestion: Hooks specialized for MongoDB [\#280](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/280)
- How to handle streams in a hook [\#262](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/262)
- iff doesn't bind hook functions to service instance [\#258](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/258)
- serialize for Sequelize [\#245](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/245)
- Common Hooks validateschema error [\#229](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/229)
- There may be an interaction between softDelete and authentication [\#185](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/185)
- Convert fields coming in from query params [\#184](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/184)
- Allow softDelete to support dates/timestamps [\#130](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/130)
- hook.params.query.$disableSoftDelete is a security issue [\#128](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/128)

**Merged pull requests:**

- Final changes and tests for softDelete2 [\#419](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/419) ([eddyystop](https://github.com/eddyystop))

## [v4.14.3](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.14.3) (2018-07-09)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.14.2...v4.14.3)

## [v4.14.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.14.2) (2018-07-09)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.14.1...v4.14.2)

**Closed issues:**

- How to stop requests from 'external'? [\#415](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/415)

**Merged pull requests:**

- Fix prevent changes and discard hooks [\#406](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/406) ([SteffenLanger](https://github.com/SteffenLanger))

## [v4.14.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.14.1) (2018-07-03)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.14.0...v4.14.1)

**Merged pull requests:**

- \[security issue\] fix populate injecting provider into source schema argument [\#414](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/414) ([antarasi](https://github.com/antarasi))

## [v4.14.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.14.0) (2018-06-26)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.13.0...v4.14.0)

**Merged pull requests:**

- Added callingParams, callingParamsDefault hooks. Replaced makeCallingParams [\#411](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/411) ([eddyystop](https://github.com/eddyystop))

## [v4.13.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.13.0) (2018-06-26)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.12.1...v4.13.0)

**Fixed bugs:**

- SoftDelete catches all errors [\#257](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/257)

**Closed issues:**

- softDelete does not trace the errors that occur in the get call [\#389](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/389)

**Merged pull requests:**

- Update soft-delete.js [\#410](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/410) ([bertho-zero](https://github.com/bertho-zero))

## [v4.12.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.12.1) (2018-06-20)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.12.0...v4.12.1)

**Closed issues:**

- \[Question\] Modify Another Resources using An Services [\#407](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/407)

**Merged pull requests:**

- restore alterItems for works with sync methods [\#409](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/409) ([bertho-zero](https://github.com/bertho-zero))

## [v4.12.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.12.0) (2018-06-05)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.11.3...v4.12.0)

**Implemented enhancements:**

- Async functions in alterItems don't work [\#367](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/367)
- Add hooks for GraphQL [\#319](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/319)
- alterItems now works with an async callback function [\#371](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/371) ([sean-nicholas](https://github.com/sean-nicholas))

**Merged pull requests:**

- Correct linting. [\#404](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/404) ([eddyystop](https://github.com/eddyystop))

## [v4.11.3](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.11.3) (2018-06-05)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.11.2...v4.11.3)

## [v4.11.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.11.2) (2018-06-05)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.11.1...v4.11.2)

**Implemented enhancements:**

- keep transform null result to an empty object. [\#394](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/394)
- runHook before [\#384](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/384)

**Fixed bugs:**

- `discard` fails on null properties [\#368](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/368)

**Closed issues:**

- checkContext should use isProvider [\#393](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/393)
- Issue with populate subdocument field [\#392](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/392)
- Only serialize a populated field if it exists [\#391](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/391)
- Doc url in header [\#388](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/388)
- Coerce result [\#387](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/387)

**Merged pull requests:**

- getByDot no-ops non-obejct records [\#403](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/403) ([eddyystop](https://github.com/eddyystop))
- keep hook ignores records which are not objects [\#402](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/402) ([eddyystop](https://github.com/eddyystop))
- closes \#368 [\#400](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/400) ([bertho-zero](https://github.com/bertho-zero))
- Enable Semistandard and update code style [\#396](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/396) ([daffl](https://github.com/daffl))
- Update all dependencies and badges [\#395](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/395) ([daffl](https://github.com/daffl))

## [v4.11.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.11.1) (2018-04-26)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.11.0...v4.11.1)

**Implemented enhancements:**

- fastJoin Guide and API examples now all show pagination being disabled. [\#376](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/376)

**Fixed bugs:**

- set-slug corrected for feathers buzzard [\#381](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/381) ([m4n0v31](https://github.com/m4n0v31))

**Closed issues:**

- sub include relations with Sequelize: Query error [\#378](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/378)
- Add allowChanges as a hook [\#377](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/377)

## [v4.11.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.11.0) (2018-04-12)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.10.0...v4.11.0)

**Implemented enhancements:**

- Fix deletion of array items [\#375](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/375) ([RubyRubenstahl](https://github.com/RubyRubenstahl))

**Fixed bugs:**

- preventChange: example does not have a boolean as the first param. [\#374](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/374)

## [v4.10.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.10.0) (2018-03-11)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.9.0...v4.10.0)

## [v4.9.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.9.0) (2018-03-11)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.8.0...v4.9.0)

**Implemented enhancements:**

- consider a new `disableMultiItemCreate` just like `disableMultiItemChange`? [\#308](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/308)

**Merged pull requests:**

- Revert ajv from 6.1.1 to 5.5.2. Errors testing schemas in existing ajv instances. [\#373](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/373) ([eddyystop](https://github.com/eddyystop))

## [v4.8.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.8.0) (2018-02-19)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.7.0...v4.8.0)

**Implemented enhancements:**

- `mongoKeys` can also used in `before` `update/patch/remove` [\#361](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/361)
- Consider returning `feathers.SKIP` whenever context.result is set. [\#355](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/355)
- support for context.dispatch [\#340](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/340)
- Standardize on a way to pass go/no-go flags to hooks [\#309](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/309)
- Does context.result = null skip remaining hooks?  [\#240](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/240)
- Cancelling further hooks [\#236](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/236)
- allow mongoKeys running for all methods [\#363](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/363) ([beeplin](https://github.com/beeplin))
- Allow `mongoKeys` for update/patch/remove [\#362](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/362) ([beeplin](https://github.com/beeplin))

**Closed issues:**

- How to filter fastjoin datas [\#360](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/360)
- fastjoin strange results, $sort not respected [\#359](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/359)

## [v4.7.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.7.0) (2018-02-08)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.5.6...v4.7.0)

**Merged pull requests:**

- Changed license to MIT [\#357](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/357) ([eddyystop](https://github.com/eddyystop))

## [v4.5.6](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.5.6) (2018-02-05)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.5.5...v4.5.6)

**Implemented enhancements:**

- hook to increment a value [\#226](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/226)

## [v4.5.5](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.5.5) (2018-02-05)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.5.4...v4.5.5)

**Closed issues:**

- fix replaceItems [\#341](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/341)

**Merged pull requests:**

- Refactored alterItems to remove unneeded code. [\#354](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/354) ([eddyystop](https://github.com/eddyystop))

## [v4.5.4](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.5.4) (2018-02-05)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.5.3...v4.5.4)

## [v4.5.3](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.5.3) (2018-02-05)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.5.2...v4.5.3)

**Fixed bugs:**

- Fixed bug in cache for get, update, patch, remove. [\#352](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/352) ([eddyystop](https://github.com/eddyystop))

**Closed issues:**

- cache has TypeError with JWT authentication [\#327](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/327)

## [v4.5.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.5.2) (2018-02-05)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.5.1...v4.5.2)

**Fixed bugs:**

- 'required' hook [\#344](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/344)

**Merged pull requests:**

- Fixed issue with mongoKeys and $sort [\#356](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/356) ([eddyystop](https://github.com/eddyystop))
- Fixed . Restricted to create, update, patch [\#351](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/351) ([eddyystop](https://github.com/eddyystop))

## [v4.5.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.5.1) (2018-02-03)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.5.0...v4.5.1)

**Fixed bugs:**

- Fixed mongoKeys [\#349](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/349) ([eddyystop](https://github.com/eddyystop))

**Merged pull requests:**

- Fixed mongoKeys. [\#350](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/350) ([eddyystop](https://github.com/eddyystop))

## [v4.5.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.5.0) (2018-02-03)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v4.3.0...v4.5.0)

**Implemented enhancements:**

- Added mongoKeys hook. [\#348](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/348) ([eddyystop](https://github.com/eddyystop))

**Closed issues:**

- Publish v4 on npm [\#343](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/343)

## [v4.3.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v4.3.0) (2018-01-29)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.10.0...v4.3.0)

**Implemented enhancements:**

- makeCallingParams include not working [\#334](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/334)
- \[feature request\] alterItems allows async func? [\#307](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/307)
- preventChanges - add an option [\#275](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/275)
- debug\(\) to show more optional info [\#273](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/273)
- Add a hook to disable pagination [\#263](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/263)
- populate: using cache to reduce the data query \[super-populate\] [\#256](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/256)
- pluck: Always pluck regardless of provider [\#252](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/252)
- Populate a field in an array \(and place data in that field\) [\#247](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/247)
- Internationalize validateSchema messages [\#242](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/242)
- Simple validation hook [\#223](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/223)
- Prevent certain fields from being changed [\#145](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/145)
- Update makeCallingParams hook to use getByDot/setByDot [\#335](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/335) ([Mattchewone](https://github.com/Mattchewone))
- close \#308, add disableMultiItemCreate [\#330](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/330) ([beeplin](https://github.com/beeplin))
- Fixed preventChanges to log deprecated syntax msg even if hook not called. [\#329](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/329) ([eddyystop](https://github.com/eddyystop))
- Verify deprecated syntax outside the hook function [\#325](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/325) ([guillaumerxl](https://github.com/guillaumerxl))
- Fixed version\# [\#324](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/324) ([eddyystop](https://github.com/eddyystop))
- Support a Promise result from alterItems to indicate mutations are complete. [\#313](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/313) ([eddyystop](https://github.com/eddyystop))
- Convert to using @feathersjs/errors properly [\#312](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/312) ([eddyystop](https://github.com/eddyystop))
- Added runParallel hook. [\#304](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/304) ([eddyystop](https://github.com/eddyystop))
- Added required hook to check fields dot notation. [\#303](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/303) ([eddyystop](https://github.com/eddyystop))
- Added disablePagination hook. [\#302](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/302) ([eddyystop](https://github.com/eddyystop))
- Added features to debug\(\). context.params keys & display selected values. [\#301](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/301) ([eddyystop](https://github.com/eddyystop))
- Added option to preventChanges to remove invalid prop names rather th… [\#300](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/300) ([eddyystop](https://github.com/eddyystop))
- Added integration test feathers+fastJoin+persistent cache. [\#298](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/298) ([eddyystop](https://github.com/eddyystop))
- Added cache hook. Can interface with LRU cache or Map\(\). [\#296](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/296) ([eddyystop](https://github.com/eddyystop))
- Added discard-query to deprecate remove-query for naming consistency. [\#295](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/295) ([eddyystop](https://github.com/eddyystop))
- Passing context to alterItems. Improved tests [\#294](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/294) ([eddyystop](https://github.com/eddyystop))
- Add alterItems hook with imperative API [\#293](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/293) ([eddyystop](https://github.com/eddyystop))
- Added keepQuery to replace pluckQuery for more consistent naming [\#292](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/292) ([eddyystop](https://github.com/eddyystop))
- Renamed thenifyHook to runHook so its more appropriate for async/awair [\#291](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/291) ([eddyystop](https://github.com/eddyystop))
- Added tests for thenifyHook examples used in API docs [\#290](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/290) ([eddyystop](https://github.com/eddyystop))
- Changed hook object's field name from hook to context. [\#286](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/286) ([eddyystop](https://github.com/eddyystop))
- Deprecate hook. Play nice with TypeScript and Babel `import`. [\#285](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/285) ([eddyystop](https://github.com/eddyystop))
- Deprecated pluck and client hooks [\#283](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/283) ([eddyystop](https://github.com/eddyystop))
- Added fastJoin and related makeCallingParams plus tests [\#281](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/281) ([eddyystop](https://github.com/eddyystop))
- Remove deprecated hooks [\#279](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/279) ([daffl](https://github.com/daffl))
- Remove filters and permissions [\#278](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/278) ([daffl](https://github.com/daffl))
- Update and verify compatibility with Feathers v3 [\#277](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/277) ([daffl](https://github.com/daffl))
- Update to new plugin infrastructure [\#274](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/274) ([daffl](https://github.com/daffl))

**Fixed bugs:**

- StashBefore should skip the id check when a query is provided [\#337](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/337)
- Fixed issue \#337 and included relevant test - ignore missing id when … [\#338](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/338) ([Protoss78](https://github.com/Protoss78))
- Fixed issue with params being populated at the wrong level [\#336](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/336) ([Mattchewone](https://github.com/Mattchewone))
- Modify keep hook to only ignore undefined values. [\#316](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/316) ([otang](https://github.com/otang))
- Fixed fastJoin bug in nested joins with no args [\#311](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/311) ([eddyystop](https://github.com/eddyystop))
- Fix feathersErrors.errors === undefined error [\#310](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/310) ([SteffenLanger](https://github.com/SteffenLanger))
- Deprecate client hook properly so a msg is logged only when its used. [\#297](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/297) ([eddyystop](https://github.com/eddyystop))
- Node v6 will not run fastJoin async tests [\#282](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/282) ([eddyystop](https://github.com/eddyystop))

**Closed issues:**

- can you please push 4.1.0 to npm [\#326](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/326)
- TypeError: disablePagination is not a function [\#323](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/323)
- populate: Using a function for schema [\#214](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/214)
- Rename hook object to context [\#201](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/201)
- populate a field in an array [\#142](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/142)

**Merged pull requests:**

- Improve alterItems hook: can map to a newly created object [\#332](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/332) ([beeplin](https://github.com/beeplin))
- Minor semver change for disableMultiItemCreate hook. [\#331](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/331) ([eddyystop](https://github.com/eddyystop))
- corrections re versions [\#320](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/320) ([musicformellons](https://github.com/musicformellons))

## [v3.10.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.10.0) (2017-10-21)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.9.0...v3.10.0)

## [v3.9.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.9.0) (2017-10-21)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.8.0...v3.9.0)

## [v3.8.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.8.0) (2017-10-21)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.7.3...v3.8.0)

**Implemented enhancements:**

- Drop Node4 testing [\#269](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/269) ([eddyystop](https://github.com/eddyystop))
- Keep hook [\#266](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/266) ([Mattchewone](https://github.com/Mattchewone))

**Closed issues:**

- Populate hook includes data from wrong db service when using a custom query in find [\#254](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/254)

## [v3.7.3](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.7.3) (2017-09-17)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.7.2...v3.7.3)

**Implemented enhancements:**

- Allow schema IDs in first parameter of validateSchema [\#251](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/251) ([CypherAlmasy](https://github.com/CypherAlmasy))

**Closed issues:**

- An in-range update of feathers is breaking the build 🚨 [\#249](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/249)

**Merged pull requests:**

- Add babel-polyfill and package-lock.json [\#250](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/250) ([daffl](https://github.com/daffl))

## [v3.7.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.7.2) (2017-08-23)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.7.1...v3.7.2)

**Implemented enhancements:**

- no need for populate in softDelete [\#253](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/253) ([superbarne](https://github.com/superbarne))
- Fix \_include being overwritten with empty array [\#246](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/246) ([rodeyseijkens](https://github.com/rodeyseijkens))

**Closed issues:**

- Support $search in query syntax [\#141](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/141)
- Look into the Babel transpiling issue in a section of populate hook. [\#116](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/116)

**Merged pull requests:**

- Update debug to the latest version 🚀 [\#244](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/244) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))

## [v3.7.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.7.1) (2017-08-07)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.7.0...v3.7.1)

**Fixed bugs:**

- Correct falsy provider handling [\#243](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/243) ([adamvr](https://github.com/adamvr))

## [v3.7.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.7.0) (2017-08-06)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.6.1...v3.7.0)

**Implemented enhancements:**

- Add top level provider option to populate hook [\#239](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/239) ([adamvr](https://github.com/adamvr))

**Closed issues:**

- Get user is called 4 times in main usage case instead of 1 [\#164](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/164)

## [v3.6.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.6.1) (2017-07-27)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.6.0...v3.6.1)

**Implemented enhancements:**

- Made `populate` hook friendlier to `thenifyHook` util [\#233](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/233) ([eddyystop](https://github.com/eddyystop))

**Fixed bugs:**

- Fixed 2 issues with validateSchema [\#234](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/234) ([eddyystop](https://github.com/eddyystop))

## [v3.6.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.6.0) (2017-07-27)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.5.5...v3.6.0)

**Implemented enhancements:**

- Added hook utility thenifyHook [\#232](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/232) ([eddyystop](https://github.com/eddyystop))

**Closed issues:**

- Store `deleted` \(soft-delete\) fields as a date instead of a boolean [\#228](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/228)
- populate: hook.params.user is not populated in child items [\#220](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/220)

**Merged pull requests:**

- Update sift to the latest version 🚀 [\#230](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/230) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))

## [v3.5.5](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.5.5) (2017-06-20)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.5.3...v3.5.5)

**Fixed bugs:**

- Setting useInnerPopulate to false causes child schema to populate [\#218](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/218)
- Updated stashBefore so it clones context.data rather than references it. [\#219](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/219) ([eddyystop](https://github.com/eddyystop))

## [v3.5.3](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.5.3) (2017-06-19)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.5.2...v3.5.3)

## [v3.5.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.5.2) (2017-06-19)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.5.1...v3.5.2)

**Fixed bugs:**

- Update populate.js [\#206](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/206) ([Creiger](https://github.com/Creiger))

**Closed issues:**

- Unpin ajv dependency so Greenkeeper can move to 5.1.6 once ajv fixes its issue. [\#213](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/213)
- An in-range update of ajv is breaking the build 🚨 [\#211](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/211)
- Gain access to the current hook object inside the validateSchema async validator [\#209](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/209)

**Merged pull requests:**

- Unpin AJV dependency [\#216](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/216) ([daffl](https://github.com/daffl))
- Update ajv to the latest version 🚀 [\#215](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/215) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- fix: pin ajv to 5.1.5 [\#212](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/212) ([eddyystop](https://github.com/eddyystop))

## [v3.5.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.5.1) (2017-05-30)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.5.0...v3.5.1)

**Implemented enhancements:**

- Add defer Hook [\#67](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/67)

**Fixed bugs:**

- add missing `feathers-hooks` dependency [\#202](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/202) ([ahdinosaur](https://github.com/ahdinosaur))

**Closed issues:**

- Question: Way to skip hooks? [\#204](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/204)

**Merged pull requests:**

- Changed tests for chai 4.0.0 [\#205](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/205) ([eddyystop](https://github.com/eddyystop))

## [v3.5.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.5.0) (2017-05-24)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.3.3...v3.5.0)

## [v3.3.3](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.3.3) (2017-05-24)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.4.0...v3.3.3)

**Implemented enhancements:**

- Added stashBefore hook to stash current value of record before [\#199](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/199) ([eddyystop](https://github.com/eddyystop))

**Merged pull requests:**

- Changed hook =\> context in hooks referred to in The Basics [\#200](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/200) ([eddyystop](https://github.com/eddyystop))

## [v3.4.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.4.0) (2017-05-24)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.3.2...v3.4.0)

**Implemented enhancements:**

- Make childField and parentField optional to support custom queries [\#187](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/187)
- Allow parents to enable populate on their direct children  [\#186](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/186)
- Added tests in populate for non related field joins [\#195](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/195) ([eddyystop](https://github.com/eddyystop))
- Enhanced populate so parentField and childField are optional [\#194](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/194) ([eddyystop](https://github.com/eddyystop))
- Improved code quality of populate [\#193](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/193) ([eddyystop](https://github.com/eddyystop))
- Added useInnerPopulate option to populate [\#192](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/192) ([eddyystop](https://github.com/eddyystop))
- Improved code quality of "populate" [\#190](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/190) ([eddyystop](https://github.com/eddyystop))

**Fixed bugs:**

- Resolved issues in softDelete caused by pull \#163 [\#197](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/197) ([eddyystop](https://github.com/eddyystop))
- Fixed populate issue with recursive include [\#191](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/191) ([eddyystop](https://github.com/eddyystop))
- Fix params-from-client import statement [\#189](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/189) ([mxgr7](https://github.com/mxgr7))

**Closed issues:**

- Should discard and populate first make a copy of the result objects? [\#150](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/150)

**Merged pull requests:**

- Small text edits in tests [\#198](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/198) ([eddyystop](https://github.com/eddyystop))
- Deprecated client tests in favor of params-from-client tests [\#196](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/196) ([eddyystop](https://github.com/eddyystop))

## [v3.3.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.3.2) (2017-05-09)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.3.1...v3.3.2)

## [v3.3.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.3.1) (2017-05-09)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.3.0...v3.3.1)

## [v3.3.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.3.0) (2017-05-09)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.2.0...v3.3.0)

**Implemented enhancements:**

- Add hook to post-filter results [\#178](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/178)
- softDelete fix for double 'get' call is not ideal [\#163](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/163)
- \[feature request\] validateSchema receives ajv instance instead of Ajv constructor [\#154](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/154)
- debug hook doesn't log error on error hook [\#152](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/152)
- Populate should throw upon detecting an ORM result. [\#144](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/144)
- Populate should allow empty relationship field [\#138](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/138)
- Populate should error when related entity is not found [\#135](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/135)
- populate should set provider to null [\#134](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/134)
- Added sifter hook - filter result with mongodb queries [\#182](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/182) ([eddyystop](https://github.com/eddyystop))
- Added setNow hook [\#181](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/181) ([eddyystop](https://github.com/eddyystop))
- Added paramsForServer util & paramsFromClient hook. Issues \#123 [\#177](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/177) ([eddyystop](https://github.com/eddyystop))
- enable array syntax for `iff`, `iff-else` and `when` [\#176](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/176) ([beeplin](https://github.com/beeplin))
- Added preventChanges before patch hook [\#175](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/175) ([eddyystop](https://github.com/eddyystop))
- Added existsByDot util in preparaion for leaveAlone hook [\#174](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/174) ([eddyystop](https://github.com/eddyystop))
- Added provider to populate schema. Issue \#134 [\#172](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/172) ([eddyystop](https://github.com/eddyystop))
- Fixed populate to return \[\] or null if no joined records found. Issue… [\#171](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/171) ([eddyystop](https://github.com/eddyystop))
- Allow undefined parentField in populate. Issue \#138 [\#170](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/170) ([eddyystop](https://github.com/eddyystop))
- Populate thows if ORM found. Issue \#144 [\#169](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/169) ([eddyystop](https://github.com/eddyystop))
- Fixed debug hook issue \#152 [\#167](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/167) ([eddyystop](https://github.com/eddyystop))
- Fixed softDelete issues \#147, \#163 [\#166](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/166) ([eddyystop](https://github.com/eddyystop))
- Add async schema validation support [\#159](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/159) ([TheBeastOfCaerbannog](https://github.com/TheBeastOfCaerbannog))

**Fixed bugs:**

- serialize mutates the given schema [\#158](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/158)
- Make softDelete more rugged [\#147](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/147)
- Using iff with restrictToOwner [\#140](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/140)
- Edited shift hook text [\#183](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/183) ([eddyystop](https://github.com/eddyystop))
- Fixed reported param issue in serialize. Issue \#158 [\#173](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/173) ([eddyystop](https://github.com/eddyystop))
- Removed unneeded console.log's in verifySchema [\#168](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/168) ([eddyystop](https://github.com/eddyystop))
- Fixes 'homepage' in package.json [\#165](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/165) ([cpsubrian](https://github.com/cpsubrian))

**Closed issues:**

- Consolidate setCreatedAt and setUpdatedAt hooks to a more generic hook [\#129](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/129)
- Add array traversal to `pluck` hook [\#126](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/126)
- Add a client-side hook which formats client params for server-side `client` hook. [\#123](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/123)
- Filter returned items keeping those that satisfy some criteria [\#77](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/77)

## [v3.2.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.2.0) (2017-05-01)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.1.0...v3.2.0)

## [v3.1.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.1.0) (2017-05-01)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.0.0...v3.1.0)

**Implemented enhancements:**

- Soft delete doubles calls for service.get [\#161](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/161)
- test for validate-schema with ajv instance passed [\#162](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/162) ([beeplin](https://github.com/beeplin))
- Soft delete will call service.get only once [\#160](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/160) ([NikitaVlaznev](https://github.com/NikitaVlaznev))

**Merged pull requests:**

- Update ajv to the latest version 🚀 [\#157](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/157) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Update semistandard to the latest version 🚀 [\#156](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/156) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Update feathers-hooks to the latest version 🚀 [\#151](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/151) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Update dependencies to enable Greenkeeper 🌴 [\#148](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/148) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))

## [v3.0.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.0.0) (2017-04-08)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v3.0.0-pre.1...v3.0.0)

**Closed issues:**

- Set model relations for sequelize [\#69](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/69)

**Merged pull requests:**

- Avoided side-effect of client [\#137](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/137) ([eddyystop](https://github.com/eddyystop))
- Update README.md [\#127](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/127) ([j2L4e](https://github.com/j2L4e))
- Changed reference to correct replacement hook. [\#124](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/124) ([eddyystop](https://github.com/eddyystop))

## [v3.0.0-pre.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v3.0.0-pre.1) (2017-02-02)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v2.0.3...v3.0.0-pre.1)

**Implemented enhancements:**

- New populate support `setByDot`  [\#85](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/85)
- "if else" hook [\#53](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/53)
- Validate hook too limited [\#50](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/50)
- Normalize hook.result from mongoose and sequelize [\#39](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/39)
- utility hook to trim data [\#37](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/37)
-  Sanitize strings to prevent XSS attacks, remove HTML and \<script\> tags. [\#35](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/35)
- Disable multi-record patch and update [\#29](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/29)
- disable hook seems to have wrong true/false logic [\#28](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/28)
- Distinct Search hook [\#16](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/16)

**Closed issues:**

- Wrong provider logic in some places [\#121](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/121)
- Populate need a test for schema:function\(\){} [\#117](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/117)
- Deprecate remove for delete [\#115](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/115)
- Let populate ensure its schema was meant for the service its being used with [\#101](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/101)
- Can I feed the populate hook an id from a separate join table ? [\#100](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/100)
- Disable hook: remove last param being a predicate func. [\#98](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/98)
- Option {paginate: false} for populate hook [\#95](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/95)
- Populate hook clobbers pagination total [\#93](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/93)
- Migration guide for deprecations [\#91](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/91)
- getByDot throws TypeError if undefined obj is passed as first argument [\#87](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/87)
- Populate hook: parentField and childField are confusing [\#86](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/86)
- Change response code [\#80](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/80)
- use a slug instead of id in service methods [\#79](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/79)
- Read service using a slug instead of just \_id [\#78](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/78)
- v2.0.3 isn't published on NPM [\#74](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/74)
- Make conditional hooks compatible with unless [\#70](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/70)
- Improve setByDot [\#58](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/58)
- Remove doc for each hook from README [\#54](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/54)
- Example to add to docs [\#43](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/43)
- doc some PRs [\#41](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/41)
- Should each hook be in their own repository? [\#31](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/31)

**Merged pull requests:**

- validateSchema's 2nd parameter can be ajv instance [\#155](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/155) ([beeplin](https://github.com/beeplin))
- Prepare for 3.0.0 prerelease [\#122](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/122) ([daffl](https://github.com/daffl))
- Added discard hook to deprecate the remove hook. [\#120](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/120) ([eddyystop](https://github.com/eddyystop))
- Added tests that populate's options.schema may be a function [\#119](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/119) ([eddyystop](https://github.com/eddyystop))
- Dep remove [\#118](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/118) ([eddyystop](https://github.com/eddyystop))
- Bump dependencies; Use shx [\#114](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/114) ([eddyystop](https://github.com/eddyystop))
- Changed populate so it throws if option.schema not an object [\#112](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/112) ([eddyystop](https://github.com/eddyystop))
- Added disableMultiItemChange hook, throws if id===null for update, patch, remove [\#110](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/110) ([eddyystop](https://github.com/eddyystop))
- Enhanced validate hook [\#109](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/109) ([eddyystop](https://github.com/eddyystop))
- Added disallow hook to start to deprecate disable hook. [\#108](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/108) ([eddyystop](https://github.com/eddyystop))
- Added dot notation support for nameAs option in populate & dePopulate hooks [\#107](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/107) ([eddyystop](https://github.com/eddyystop))
- Deprecated setByDot usage for deleting props. Converted hooks to deleteByDot [\#106](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/106) ([eddyystop](https://github.com/eddyystop))
- Added deleteByDot util to support dot notation for populate nameAs option [\#105](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/105) ([eddyystop](https://github.com/eddyystop))
- Fixed bug in replaceItems involving hook.result.total [\#104](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/104) ([eddyystop](https://github.com/eddyystop))
- Populate 3 [\#103](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/103) ([eddyystop](https://github.com/eddyystop))
- Flatten tests [\#102](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/102) ([eddyystop](https://github.com/eddyystop))
- Split services hooks into individual files [\#97](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/97) ([eddyystop](https://github.com/eddyystop))
- Finish split of filters/ and permissions/. Prepare hooks/ for split. [\#94](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/94) ([eddyystop](https://github.com/eddyystop))
- Break out filter and permission modules by hook [\#92](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/92) ([eddyystop](https://github.com/eddyystop))
- Switching over to reorganized hook modules [\#90](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/90) ([eddyystop](https://github.com/eddyystop))
- Working around another Babel-core 6.17.0 transpilation error in iffElse [\#89](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/89) ([eddyystop](https://github.com/eddyystop))
- Allowing populate include:{...} to act like include:\[{...}\] [\#88](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/88) ([eddyystop](https://github.com/eddyystop))
- Fixed 6.17.0 Babel transpiling error [\#84](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/84) ([eddyystop](https://github.com/eddyystop))
- Update all dependencies 🌴 [\#82](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/82) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Created support for event filter and permission hooks. Reorganized service hooks because of this. [\#75](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/75) ([eddyystop](https://github.com/eddyystop))
- Traverse and change hook.data .result .query or hook.anyObj [\#73](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/73) ([eddyystop](https://github.com/eddyystop))
- Fix JSDoc for disable hook [\#72](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/72) ([bertho-zero](https://github.com/bertho-zero))
- Fixed comments in every & some [\#71](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/71) ([eddyystop](https://github.com/eddyystop))
- Added validateSchema hook to validate JSON objects [\#68](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/68) ([eddyystop](https://github.com/eddyystop))
- adding unless hook [\#66](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/66) ([ekryski](https://github.com/ekryski))
- add $client hook [\#65](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/65) ([eddyystop](https://github.com/eddyystop))
- adding when alias for iff [\#64](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/64) ([ekryski](https://github.com/ekryski))
- adding an every hook [\#63](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/63) ([ekryski](https://github.com/ekryski))
- Added new populate, dePopulate, serialze hooks. [\#62](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/62) ([eddyystop](https://github.com/eddyystop))
- adding a some hook [\#61](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/61) ([ekryski](https://github.com/ekryski))
- Removed all the hook documentation from the README [\#60](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/60) ([eddyystop](https://github.com/eddyystop))
- Improved perf on the most common usage of getByDot, setByDot [\#59](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/59) ([eddyystop](https://github.com/eddyystop))
- Added support for iff\(\).else\(hook1, hook2, ...\) [\#57](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/57) ([eddyystop](https://github.com/eddyystop))
- Added a hook to execute a set of hooks [\#56](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/56) ([eddyystop](https://github.com/eddyystop))
- Added tests to cover 2 reported issues [\#55](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/55) ([eddyystop](https://github.com/eddyystop))

## [v2.0.3](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v2.0.3) (2016-11-29)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v2.0.2...v2.0.3)

**Closed issues:**

- Validate sync function do nothing [\#49](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/49)
- softDelete "Cannot read property 'hasOwnProperty' of undefined" [\#48](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/48)
- softDelete undefined.patch issue [\#44](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/44)
- Support an array of hooks [\#19](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/19)

**Merged pull requests:**

- Added support for multiple hooks in iff\(\) [\#52](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/52) ([eddyystop](https://github.com/eddyystop))

## [v2.0.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v2.0.2) (2016-11-28)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v2.0.1...v2.0.2)

**Implemented enhancements:**

- Consider: allow $select in params query when get [\#32](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/32)
- Allow softDelete on all methods [\#30](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/30)

**Closed issues:**

- Hooks shouldn't be arrow functions [\#47](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/47)
- Proposal for permissions in populate++ [\#42](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/42)
- Proposal for populates++ hook [\#38](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/38)
- Support more complex populates [\#23](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/23)
- Support users\[\].password notation in remove to loop through arrays [\#21](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/21)
- Use changelog generator [\#9](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/9)

**Merged pull requests:**

- Rewrote softDelete to properly handle all methods [\#51](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/51) ([eddyystop](https://github.com/eddyystop))
- fix setUpdatedAt and setCreatedAt [\#46](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/46) ([alerosa](https://github.com/alerosa))
- Fix \#30 \(allow all hooks\) and \#44 \(arrow function can't reference this\) [\#45](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/45) ([KidkArolis](https://github.com/KidkArolis))
- Fix softDelete error on 'find' [\#40](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/40) ([jojobyte](https://github.com/jojobyte))

## [v2.0.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v2.0.1) (2016-11-04)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v2.0.0...v2.0.1)

**Closed issues:**

- Funcs in promisify.js [\#18](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/18)
- Add performance/logging hook [\#14](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/14)
- Standardize scripts [\#13](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/13)

**Merged pull requests:**

- Fix bug in populate, sending wrong params [\#34](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/34) ([danieledler](https://github.com/danieledler))
- Fix error in populate hook description example [\#33](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/33) ([danieledler](https://github.com/danieledler))
- Update to latest plugin infrastructure [\#27](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/27) ([daffl](https://github.com/daffl))

## [v2.0.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v2.0.0) (2016-10-29)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.7.2...v2.0.0)

**Closed issues:**

- Add to doc that JS can create array of hooks [\#20](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/20)
- Remove Node 4 hacks [\#17](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/17)
- Sanitize query in hooks [\#15](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/15)
- Do Code Climate analysis again [\#11](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/11)
- Run CI with Node 4, 6 and latest [\#10](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/10)
- Change linting from AirBnB to semistandard [\#8](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/8)
- Change test names from \*\_spec.js to \*.test.js [\#7](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/7)
- Update to latest plugin infrastructure [\#4](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/4)

**Merged pull requests:**

- Remove dependency on feathers-authentication [\#26](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/26) ([daffl](https://github.com/daffl))
- Added promiseToCallback, perhaps more rugged than Feathers' code [\#25](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/25) ([eddyystop](https://github.com/eddyystop))
- Removed overly complex promisify function wrappers [\#24](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/24) ([eddyystop](https://github.com/eddyystop))
- Remove the lib/ folder [\#22](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/22) ([daffl](https://github.com/daffl))
- Fixed tests which had failed in Node 4 [\#12](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/12) ([eddyystop](https://github.com/eddyystop))
- Switched from AirBnB to semistandard [\#6](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/6) ([eddyystop](https://github.com/eddyystop))
- Rename test files to Feathers standard [\#5](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/5) ([eddyystop](https://github.com/eddyystop))

## [v1.7.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.7.2) (2016-10-07)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.7.1...v1.7.2)

**Closed issues:**

- what's the realtionship between this and feathers-hooks? [\#3](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/3)

## [v1.7.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.7.1) (2016-10-06)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.7.0...v1.7.1)

## [v1.7.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.7.0) (2016-10-04)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.6.2...v1.7.0)

## [v1.6.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.6.2) (2016-10-03)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.6.1...v1.6.2)

## [v1.6.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.6.1) (2016-10-02)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.6.0...v1.6.1)

## [v1.6.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.6.0) (2016-10-02)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.5.8...v1.6.0)

## [v1.5.8](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.5.8) (2016-09-14)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.5.7...v1.5.8)

**Merged pull requests:**

- Fix typo in README.md [\#2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/pull/2) ([bedeoverend](https://github.com/bedeoverend))

## [v1.5.7](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.5.7) (2016-09-13)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.5.6...v1.5.7)

## [v1.5.6](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.5.6) (2016-09-12)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.5.5...v1.5.6)

## [v1.5.5](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.5.5) (2016-09-12)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.5.4...v1.5.5)

## [v1.5.4](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.5.4) (2016-09-12)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.5.3...v1.5.4)

## [v1.5.3](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.5.3) (2016-09-11)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.5.2...v1.5.3)

**Closed issues:**

- Typo in Readme [\#1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/issues/1)

## [v1.5.2](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.5.2) (2016-09-08)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.5.1...v1.5.2)

## [v1.5.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.5.1) (2016-08-20)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.5.0...v1.5.1)

## [v1.5.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.5.0) (2016-08-20)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.4.1...v1.5.0)

## [v1.4.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.4.1) (2016-08-19)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.4.0...v1.4.1)

## [v1.4.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.4.0) (2016-08-19)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.3.1...v1.4.0)

## [v1.3.1](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.3.1) (2016-08-18)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/v1.3.0...v1.3.1)

## [v1.3.0](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/v1.3.0) (2016-08-18)

[Full Changelog](https://github.com/feathersjs-ecosystem/feathers-hooks-common/compare/f0b624443243bd13d2758b04c2870b6d8d6e2f22...v1.3.0)



\* *This Changelog was automatically generated by [github_changelog_generator](https://github.com/github-changelog-generator/github-changelog-generator)*
