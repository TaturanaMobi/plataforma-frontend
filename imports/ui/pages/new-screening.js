import { Meteor } from 'meteor/meteor';
// import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
// import { $ } from 'meteor/jquery';
import { ReactiveDict } from 'meteor/reactive-dict';

import '../components/autoform-nouislider.js';
import '../components/screeningFormFields';
import './new-screening.html';
import Screenings from '../../models/screenings.js';
// import { saveScreening } from '../../startup/client/helpers.js';

Template.newScreening.onCreated(function () {
  this.doc = new ReactiveDict();
  this.doc.set('data', Template.instance().data);
  this.autorun(() => {
    this.subscribe('cities', Template.instance().doc.get('data').uf);
    this.subscribe('users.me');
  });
});

Template.newScreening.onRendered(() => {
  // const player = new Plyr('#player');
  // player.volume = 1;
});

Template.newScreening.events({
  'click .remove_address'() {
    Meteor.call('removeAddress', Meteor.user()._id, this);
  },
  'click .replace_address'(event) {
    const docData = Template.instance().doc.get('data');
    Meteor.user().addresses.forEach((v) => {
      if (v._id === event.currentTarget.id) {
        Template.instance().doc.set('data', { ...docData, ...v });
      }
    });
  },
});

Template.newScreening.helpers({
  doc() {
    return Template.instance().doc.get('data');
  },
  form() {
    const address = Template.instance().doc.get('data');

    return {
      user_id: Meteor.userId(),
      filmId: this._id,
      status: 'Agendada',
      ...address,
    };
  },
  user_addresses() {
    return Meteor.user().addresses;
  },
  address() {
    return [];
    // Session.get('address');
  },
  hasPendingScreenings() {
    return Screenings.find({ status: 'Pendente' }).count() > 0;
  },
});
