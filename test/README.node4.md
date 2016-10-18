
There are tests which parse function signatures
The test which involve ...rest params or params which assign defaults cannot be run on Node 4.

They unfortunately have had to be commented out till support for Node 4 is stopped in Apr 2018 (!!).

The commented out tests are in:
- parseFunc.test.js
- getParameterNames.test.js
- getParameterNames_BUGS.test.js

Hopefully these will be periodically uncommented and run.

The alternative is to get the node version
and condition the file selection in package.json's test script.
