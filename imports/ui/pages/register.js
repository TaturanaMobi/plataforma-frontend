import { Template } from 'meteor/templating';
import './register.html';

Template.register.onCreated(function () {
  this.autorun(() => {
    this.subscribe('cities');
  });
});
