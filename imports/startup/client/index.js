// Import client startup through a single index entry point

import './routes.js';
import './routes-ambassador.js';
import './routes-admin.js';
import './hooks.js';
import './helpers.js';

Tracker.autorun(function () {
  var current = Router.current();
  Tracker.afterFlush(function () {
    $(window).scrollTop(0);
  });
});
