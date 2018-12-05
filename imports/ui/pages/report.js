import { Template } from 'meteor/templating';
import './report.html';
import './../components/reportFormFields.html';


Template.report.helpers({
  film() {
    return this.film();
  },
});
