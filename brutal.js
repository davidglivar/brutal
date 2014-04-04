module.exports = process.env.BRUTAL_COV
  ? require('./lib-cov/brutal')
  : require('./lib/brutal');
