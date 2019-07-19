import { Meteor } from 'meteor/meteor';
// import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';
// import { Uploader } from 'meteor/tomi:upload-jquery';
// import { _ } from 'meteor/underscore';

import '../components/nav.js';
import '../components/footer.html';
import '../components/loading.html';
import './app-body.html';

Meteor.startup(() => {
  $('html').attr('xml:lang', 'pt-br');
  $('html').attr('lang', 'pt-br');
});
