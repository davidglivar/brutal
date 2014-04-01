var path = require('path');
var brutal = require('./brutal').init({
  output: path.join(__dirname, 'test_output') //,
  //padding: 2
});
brutal.run(path.join(__dirname, 'test/images'));

