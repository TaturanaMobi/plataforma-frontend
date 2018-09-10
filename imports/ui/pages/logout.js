import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Router } from 'meteor/iron:router';

import './logout.html';

Template.logout.events({
  'click .logout-ambassador'(event) {
    event.preventDefault();
    Meteor.logout(() => {
      Router.go('login');
    });
  },
});
