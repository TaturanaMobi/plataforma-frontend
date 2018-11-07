import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';
import { Uploader } from 'meteor/tomi:upload-jquery';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { _ } from 'meteor/underscore';

import './../components/nav.html';
import './../components/footer.html';
import './../components/loading.html';
import './app-body.html';

Meteor.startup(() => {
  $('html').attr('xml:lang', 'pt-br');
  $('html').attr('lang', 'pt-br');

  Uploader.finished = (index, fileInfo, body) => {
    const fType = body.data.formData.file_type;
    Session.set(fType, fileInfo.path);
  };

  FlashMessages.configure({
    autoHide: true,
    hideDelay: 4000,
    autoScroll: true,
  });
});
