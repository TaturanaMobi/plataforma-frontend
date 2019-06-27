import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import i18n from 'meteor/universe:i18n';
import './nav.html';

Template.nav.events({
  'click .logout-ambassador'(event) {
    event.preventDefault();
    Meteor.logout(() => {
      Router.go('login');
    });
  },
  'click .nav__translation-flag'() {
    Router.go('en');
  },
});
Template.nav.bindI18nNamespace('common');
console.log(i18n.getLocale());
