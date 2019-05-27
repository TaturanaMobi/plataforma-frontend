import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import './nav.html';

Template.nav.events({
  'click .logout-ambassador'(event) {
    event.preventDefault();
    Meteor.logout(() => {
      Router.go('login');
    });
  },
});
