import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import './ambassadorFormFields.html';

Template.ambassadorFormFields.helpers({
  user_email() {
    return (Meteor.user()) ? Meteor.user().emails[0].address : '';
  },
  showPassword() {
    return Router.current().route.getName() === 'register';
  },

});

