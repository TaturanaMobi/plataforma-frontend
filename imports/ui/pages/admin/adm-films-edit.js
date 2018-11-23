import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import 'bootstrap-sass';
import './adm-films-edit.html';

Template.admFilmsEdit.onRendered(() => {
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
