var page = require('webpage').create()
  , system = require('system')
  , args = system.args
  , arg = JSON.parse(decodeURIComponent(args[1]));

page.open(phantom.libraryPath + '/draw.html', function (status) {

  var timeout = 100
    , counter = 0;

  function poll() {
    var returned = page.evaluate(function () {
      return window.returned;
    });
    if (!returned) {
      counter += 1;
      if (counter > timeout) {
        console.log('timed out.');
        return phantom.exit(1);
      }
      return setTimeout(poll, 100);
    }
    console.log(returned);
    phantom.exit();
  }

  page.evaluate(function (params) {
    window.draw(params);
  }, arg);

  poll();

});
