import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import './notificationTemplateFormFields.html';
// import Films from '../../models/films.js';

// Template.notificationTemplateFormFields.helpers({
//   listFilms() {
//     return Films.find({}).fetch();
//   }
// });

Template.notificationTemplateFormFields.onRendered(() => {
  $(() => {
    $('textarea.editor').summernote();
  });
});
