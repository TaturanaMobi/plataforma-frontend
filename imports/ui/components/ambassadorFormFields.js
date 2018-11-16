import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
// import SimpleSchema from 'simpl-schema';

import './ambassadorFormFields.html';

Template.ambassadorFormFields.helpers({
  data() {
    return Meteor.user();
  },
  user_email() {
    return (Meteor.user()) ? Meteor.user().emails[0].address : '';
  },
  showPassword() {
    return Router.current().route.getName() === 'register';
  },

});

