import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import 'bootstrap-sass';
import './../../components/filmFormFields.html';
import './adm-films-new.html';

Template.admFilmsNew.onRendered(() => {
  $(() => {
    $('textarea.editor').froalaEditor({
      toolbarButtons: [
        'fullscreen',
        'bold',
        'italic',
        'underline',
        'fontFamily',
        'fontSize',
        'insertLink',
        'insertVideo',
        'insertTable',
        'undo',
        'redo',
      ],
      toolbarSticky: false,
    });
  });
});

Template.admFilmsNew.helpers({
  form() {
    return {
      userId: Meteor.userId(),
    };
  },
});
