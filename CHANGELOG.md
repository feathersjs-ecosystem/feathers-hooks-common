# Change Log

## [Unreleased](https://github.com/feathersjs/feathers-hooks-common/tree/HEAD)

[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v2.0.3...HEAD)

**Implemented enhancements:**

- "if else" hook [\#53](https://github.com/feathersjs/feathers-hooks-common/issues/53)
- utility hook to trim data [\#37](https://github.com/feathersjs/feathers-hooks-common/issues/37)

**Closed issues:**

- Make conditional hooks compatible with unless [\#70](https://github.com/feathersjs/feathers-hooks-common/issues/70)
- Remove doc for each hook from README [\#54](https://github.com/feathersjs/feathers-hooks-common/issues/54)
- doc some PRs [\#41](https://github.com/feathersjs/feathers-hooks-common/issues/41)

**Merged pull requests:**

- Traverse and change hook.data .result .query or hook.anyObj [\#73](https://github.com/feathersjs/feathers-hooks-common/pull/73) ([eddyystop](https://github.com/eddyystop))
- Fix JSDoc for disable hook [\#72](https://github.com/feathersjs/feathers-hooks-common/pull/72) ([bertho-zero](https://github.com/bertho-zero))
- Fixed comments in every & some [\#71](https://github.com/feathersjs/feathers-hooks-common/pull/71) ([eddyystop](https://github.com/eddyystop))
- adding unless hook [\#66](https://github.com/feathersjs/feathers-hooks-common/pull/66) ([ekryski](https://github.com/ekryski))
- adding when alias for iff [\#64](https://github.com/feathersjs/feathers-hooks-common/pull/64) ([ekryski](https://github.com/ekryski))
- adding an every hook [\#63](https://github.com/feathersjs/feathers-hooks-common/pull/63) ([ekryski](https://github.com/ekryski))
- Added new populate, dePopulate, serialze hooks. [\#62](https://github.com/feathersjs/feathers-hooks-common/pull/62) ([eddyystop](https://github.com/eddyystop))
- adding a some hook [\#61](https://github.com/feathersjs/feathers-hooks-common/pull/61) ([ekryski](https://github.com/ekryski))
- Removed all the hook documentation from the README [\#60](https://github.com/feathersjs/feathers-hooks-common/pull/60) ([eddyystop](https://github.com/eddyystop))
- Improved perf on the most common usage of getByDot, setByDot [\#59](https://github.com/feathersjs/feathers-hooks-common/pull/59) ([eddyystop](https://github.com/eddyystop))
- Added support for iff\(\).else\(hook1, hook2, ...\) [\#57](https://github.com/feathersjs/feathers-hooks-common/pull/57) ([eddyystop](https://github.com/eddyystop))
- Added a hook to execute a set of hooks [\#56](https://github.com/feathersjs/feathers-hooks-common/pull/56) ([eddyystop](https://github.com/eddyystop))
- Added tests to cover 2 reported issues [\#55](https://github.com/feathersjs/feathers-hooks-common/pull/55) ([eddyystop](https://github.com/eddyystop))

## [v2.0.3](https://github.com/feathersjs/feathers-hooks-common/tree/v2.0.3) (2016-11-29)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v2.0.2...v2.0.3)

**Closed issues:**

- Validate sync function do nothing [\#49](https://github.com/feathersjs/feathers-hooks-common/issues/49)
- softDelete "Cannot read property 'hasOwnProperty' of undefined" [\#48](https://github.com/feathersjs/feathers-hooks-common/issues/48)
- softDelete undefined.patch issue [\#44](https://github.com/feathersjs/feathers-hooks-common/issues/44)
- Support an array of hooks [\#19](https://github.com/feathersjs/feathers-hooks-common/issues/19)

**Merged pull requests:**

- Added support for multiple hooks in iff\(\) [\#52](https://github.com/feathersjs/feathers-hooks-common/pull/52) ([eddyystop](https://github.com/eddyystop))

## [v2.0.2](https://github.com/feathersjs/feathers-hooks-common/tree/v2.0.2) (2016-11-28)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v2.0.1...v2.0.2)

**Implemented enhancements:**

- Consider: allow $select in params query when get [\#32](https://github.com/feathersjs/feathers-hooks-common/issues/32)
- Allow softDelete on all methods [\#30](https://github.com/feathersjs/feathers-hooks-common/issues/30)

**Closed issues:**

- Hooks shouldn't be arrow functions [\#47](https://github.com/feathersjs/feathers-hooks-common/issues/47)
- Proposal for permissions in populate++ [\#42](https://github.com/feathersjs/feathers-hooks-common/issues/42)
- Proposal for populates++ hook [\#38](https://github.com/feathersjs/feathers-hooks-common/issues/38)
- Support more complex populates [\#23](https://github.com/feathersjs/feathers-hooks-common/issues/23)
- Support users\[\].password notation in remove to loop through arrays [\#21](https://github.com/feathersjs/feathers-hooks-common/issues/21)
- Use changelog generator [\#9](https://github.com/feathersjs/feathers-hooks-common/issues/9)

**Merged pull requests:**

- Rewrote softDelete to properly handle all methods [\#51](https://github.com/feathersjs/feathers-hooks-common/pull/51) ([eddyystop](https://github.com/eddyystop))
- fix setUpdatedAt and setCreatedAt [\#46](https://github.com/feathersjs/feathers-hooks-common/pull/46) ([alerosa](https://github.com/alerosa))
- Fix \#30 \(allow all hooks\) and \#44 \(arrow function can't reference this\) [\#45](https://github.com/feathersjs/feathers-hooks-common/pull/45) ([KidkArolis](https://github.com/KidkArolis))
- Fix softDelete error on 'find' [\#40](https://github.com/feathersjs/feathers-hooks-common/pull/40) ([jojobyte](https://github.com/jojobyte))

## [v2.0.1](https://github.com/feathersjs/feathers-hooks-common/tree/v2.0.1) (2016-11-04)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v2.0.0...v2.0.1)

**Closed issues:**

- Funcs in promisify.js [\#18](https://github.com/feathersjs/feathers-hooks-common/issues/18)
- Add performance/logging hook [\#14](https://github.com/feathersjs/feathers-hooks-common/issues/14)
- Standardize scripts [\#13](https://github.com/feathersjs/feathers-hooks-common/issues/13)

**Merged pull requests:**

- Fix bug in populate, sending wrong params [\#34](https://github.com/feathersjs/feathers-hooks-common/pull/34) ([danieledler](https://github.com/danieledler))
- Fix error in populate hook description example [\#33](https://github.com/feathersjs/feathers-hooks-common/pull/33) ([danieledler](https://github.com/danieledler))
- Update to latest plugin infrastructure [\#27](https://github.com/feathersjs/feathers-hooks-common/pull/27) ([daffl](https://github.com/daffl))

## [v2.0.0](https://github.com/feathersjs/feathers-hooks-common/tree/v2.0.0) (2016-10-29)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.7.2...v2.0.0)

**Closed issues:**

- Add to doc that JS can create array of hooks [\#20](https://github.com/feathersjs/feathers-hooks-common/issues/20)
- Remove Node 4 hacks [\#17](https://github.com/feathersjs/feathers-hooks-common/issues/17)
- Sanitize query in hooks [\#15](https://github.com/feathersjs/feathers-hooks-common/issues/15)
- Do Code Climate analysis again [\#11](https://github.com/feathersjs/feathers-hooks-common/issues/11)
- Run CI with Node 4, 6 and latest [\#10](https://github.com/feathersjs/feathers-hooks-common/issues/10)
- Change linting from AirBnB to semistandard [\#8](https://github.com/feathersjs/feathers-hooks-common/issues/8)
- Change test names from \*\_spec.js to \*.test.js [\#7](https://github.com/feathersjs/feathers-hooks-common/issues/7)
- Update to latest plugin infrastructure [\#4](https://github.com/feathersjs/feathers-hooks-common/issues/4)

**Merged pull requests:**

- Remove dependency on feathers-authentication [\#26](https://github.com/feathersjs/feathers-hooks-common/pull/26) ([daffl](https://github.com/daffl))
- Added promiseToCallback, perhaps more rugged than Feathers' code [\#25](https://github.com/feathersjs/feathers-hooks-common/pull/25) ([eddyystop](https://github.com/eddyystop))
- Removed overly complex promisify function wrappers [\#24](https://github.com/feathersjs/feathers-hooks-common/pull/24) ([eddyystop](https://github.com/eddyystop))
- Remove the lib/ folder [\#22](https://github.com/feathersjs/feathers-hooks-common/pull/22) ([daffl](https://github.com/daffl))
- Fixed tests which had failed in Node 4 [\#12](https://github.com/feathersjs/feathers-hooks-common/pull/12) ([eddyystop](https://github.com/eddyystop))
- Switched from AirBnB to semistandard [\#6](https://github.com/feathersjs/feathers-hooks-common/pull/6) ([eddyystop](https://github.com/eddyystop))
- Rename test files to Feathers standard [\#5](https://github.com/feathersjs/feathers-hooks-common/pull/5) ([eddyystop](https://github.com/eddyystop))

## [v1.7.2](https://github.com/feathersjs/feathers-hooks-common/tree/v1.7.2) (2016-10-07)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.7.1...v1.7.2)

**Closed issues:**

- what's the realtionship between this and feathers-hooks? [\#3](https://github.com/feathersjs/feathers-hooks-common/issues/3)

## [v1.7.1](https://github.com/feathersjs/feathers-hooks-common/tree/v1.7.1) (2016-10-06)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.7.0...v1.7.1)

## [v1.7.0](https://github.com/feathersjs/feathers-hooks-common/tree/v1.7.0) (2016-10-04)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.6.2...v1.7.0)

## [v1.6.2](https://github.com/feathersjs/feathers-hooks-common/tree/v1.6.2) (2016-10-03)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.6.1...v1.6.2)

## [v1.6.1](https://github.com/feathersjs/feathers-hooks-common/tree/v1.6.1) (2016-10-02)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.6.0...v1.6.1)

## [v1.6.0](https://github.com/feathersjs/feathers-hooks-common/tree/v1.6.0) (2016-10-02)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.5.8...v1.6.0)

## [v1.5.8](https://github.com/feathersjs/feathers-hooks-common/tree/v1.5.8) (2016-09-14)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.5.7...v1.5.8)

**Merged pull requests:**

- Fix typo in README.md [\#2](https://github.com/feathersjs/feathers-hooks-common/pull/2) ([bedeoverend](https://github.com/bedeoverend))

## [v1.5.7](https://github.com/feathersjs/feathers-hooks-common/tree/v1.5.7) (2016-09-13)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.5.6...v1.5.7)

## [v1.5.6](https://github.com/feathersjs/feathers-hooks-common/tree/v1.5.6) (2016-09-12)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.5.5...v1.5.6)

## [v1.5.5](https://github.com/feathersjs/feathers-hooks-common/tree/v1.5.5) (2016-09-12)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.5.4...v1.5.5)

## [v1.5.4](https://github.com/feathersjs/feathers-hooks-common/tree/v1.5.4) (2016-09-12)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.5.3...v1.5.4)

## [v1.5.3](https://github.com/feathersjs/feathers-hooks-common/tree/v1.5.3) (2016-09-11)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.5.2...v1.5.3)

**Closed issues:**

- Typo in Readme [\#1](https://github.com/feathersjs/feathers-hooks-common/issues/1)

## [v1.5.2](https://github.com/feathersjs/feathers-hooks-common/tree/v1.5.2) (2016-09-08)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.5.1...v1.5.2)

## [v1.5.1](https://github.com/feathersjs/feathers-hooks-common/tree/v1.5.1) (2016-08-20)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.5.0...v1.5.1)

## [v1.5.0](https://github.com/feathersjs/feathers-hooks-common/tree/v1.5.0) (2016-08-20)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.4.1...v1.5.0)

## [v1.4.1](https://github.com/feathersjs/feathers-hooks-common/tree/v1.4.1) (2016-08-19)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.4.0...v1.4.1)

## [v1.4.0](https://github.com/feathersjs/feathers-hooks-common/tree/v1.4.0) (2016-08-19)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.3.1...v1.4.0)

## [v1.3.1](https://github.com/feathersjs/feathers-hooks-common/tree/v1.3.1) (2016-08-18)
[Full Changelog](https://github.com/feathersjs/feathers-hooks-common/compare/v1.3.0...v1.3.1)

## [v1.3.0](https://github.com/feathersjs/feathers-hooks-common/tree/v1.3.0) (2016-08-18)


\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*