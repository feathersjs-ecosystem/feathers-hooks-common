
if (process.version.substr(0, 2) >= 'v8') {
  require('../../tests-async/fast-join.test');
} else {
  console.log('\n...fastJoin test ignored. Node version is prior to v8.');
}
