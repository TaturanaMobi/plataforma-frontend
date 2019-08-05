import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import '../../components/filmFormFields.html';
import './adm-films-new.html';

Template.admFilmsNew.onRendered(() => {
  $(() => {
    $('textarea.editor').summernote();
  });
});

Template.admFilmsNew.helpers({
  form() {
    return {
      userId: Meteor.userId(),
    };
  },
});
