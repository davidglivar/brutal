var page = require('webpage').create()
  , fs = require('fs')
  , system = require('system')
  , args = system.args
  , params = JSON.parse(decodeURIComponent(args[1]));

page.onAlert = function (msg) {
  system.stderr.writeLine(msg);
};

page.open(phantom.libraryPath + '/draw.html', function () {
  var timeout = 10e3 / 100
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
    try {
      fs.write(params.tmp, returned, 'w');
      phantom.exit();
    } catch (e) {
      system.stderr.writeLine(e);
      phantom.exit(1);
    }
  }

  page.evaluate(function (params) {
    window.console.log = function (msg) { alert(msg); };
    window.draw(params);
  }, params);

  poll();

});
