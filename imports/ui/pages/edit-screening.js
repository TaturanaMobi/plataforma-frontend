/* global document, window */

import { Meteor } from 'meteor/meteor';
// import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { ReactiveDict } from 'meteor/reactive-dict';


// import { saveScreening } from '../../startup/client/helpers.js';
import '../components/screeningFormFields';
import './edit-screening.html';

Template.editScreening.onCreated(function () {
  this.doc = new ReactiveDict();
  this.doc.set('data', Template.instance().data);

  this.autorun(() => {
    this.subscribe('cities', Template.instance().data.uf);
    this.subscribe('users.me');
  });
});

// Template.editScreening.onRendered(() => {
//   $("a[rel^='prettyPhoto']").prettyPhoto();
// });

Template.editScreening.events({
  'click .remove_address'() {
    Meteor.call('removeAddress', Meteor.user()._id, this);
  },
  'click .replace_address'(evt) {
    const docData = Template.instance().doc.get('data');
    Meteor.user().addresses.forEach((v) => {
      if (v._id === evt.currentTarget.id) {
        Template.instance().doc.set('data', { ...docData, ...v });
      }
    });
  },
});

Template.editScreening.helpers({
  doc() {
    return Template.instance().doc.get('data');
  },

  user_addresses() {
    return Meteor.user().addresses;
  },
});
