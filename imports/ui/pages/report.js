import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import './report.html';
import '../components/reportFormFields.html';

Template.report.onRendered(() => {
  $(() => {
    $('textarea.editor').summernote();
  });
});

Template.report.helpers({
  film() {
    return this.film();
  },
});
