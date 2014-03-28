var path = require('path');
var brutal = require('./brutal').init({
  output: path.join(__dirname, 'test_output')
});
brutal(path.join(__dirname, 'test/images'));
