import './notificationTemplateFormFields.html';
// import Films from '../../models/films.js';

// Template.notificationTemplateFormFields.helpers({
//   listFilms() {
//     return Films.find({}).fetch();
//   }
// });

Template.notificationTemplateFormFields.onRendered(() => {
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
      height: 300,
    });
  });
});