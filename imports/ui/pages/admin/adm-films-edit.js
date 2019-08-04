import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import '../../components/filmFormFields.html';
import './adm-films-edit.html';

Template.admFilmsEdit.onRendered(() => {
  $(() => {
    $('textarea.editor').summernote();
  });
});
